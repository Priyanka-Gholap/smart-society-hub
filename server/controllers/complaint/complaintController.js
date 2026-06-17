import mongoose from 'mongoose';
import Complaint from '../../models/Complaint.js';
import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Create Complaint
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      images,
      attachments,
    } = req.body;

    let aiClassification = {};
    let aiPriority = {};

    try {
      const classResponse = await axios.post(`${ML_SERVICE_URL}/api/classify-complaint`, {
        text: `${title} ${description}`,
      });
      aiClassification = classResponse.data;

      const priorityResponse = await axios.post(`${ML_SERVICE_URL}/api/predict-priority`, {
        text: `${title} ${description}`,
        category: aiClassification.predictedCategory || category,
      });
      aiPriority = priorityResponse.data;
    } catch (error) {
      console.log('ML service not available, using defaults');
    }

    const complaint = new Complaint({
      title,
      description,
      category: aiClassification.predictedCategory || category,
      priority: aiPriority.predictedLevel || 'medium',
      complainant: req.user._id,
      society: req.user.society,
      location,
      images: images || [],
      attachments: attachments || [],
      aiClassification,
      aiPriority,
    });

    await complaint.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`society_${req.user.society}`).emit('new_complaint', {
        complaintId: complaint._id,
        title,
        priority: complaint.priority,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create complaint',
    });
  }
};

// Get Complaints
export const getComplaints = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    const filter = { society: req.user.society };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    if (req.user.role === 'resident') {
      filter.complainant = req.user._id;
    }

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('complainant', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .limit(parseInt(limit, 10))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      complaints,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get Complaints Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaints',
    });
  }
};

// Get Complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate('complainant', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (
      req.user.role === 'resident' &&
      complaint.complainant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Get Complaint Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaint',
    });
  }
};

// Update Complaint Status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution, assignedTo } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;

    if (status === 'resolved' && resolution) {
      complaint.resolution = {
        description: resolution,
        resolvedDate: new Date(),
        resolvedBy: req.user._id,
      };
    }

    await complaint.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`society_${complaint.society}`).emit('complaint_updated', {
        complaintId: complaint._id,
        status: complaint.status,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated',
      complaint,
    });
  } catch (error) {
    console.error('Update Complaint Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update complaint',
    });
  }
};

// Add Complaint Update
export const addComplaintUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { update } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        $push: {
          updates: {
            text: update,
            updatedBy: req.user._id,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Update added successfully',
      complaint,
    });
  } catch (error) {
    console.error('Add Update Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add update',
    });
  }
};

// Get Complaint Analytics
export const getComplaintAnalytics = async (req, res) => {
  try {
    const societyId = req.user.society;
    const societyObjectId = new mongoose.Types.ObjectId(societyId);

    const totalComplaints = await Complaint.countDocuments({
      society: societyId,
    });

    const statusCounts = await Complaint.aggregate([
      { $match: { society: societyObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const categoryCounts = await Complaint.aggregate([
      { $match: { society: societyObjectId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const resolutionRate = totalComplaints
      ? (
          (statusCounts.find((statusEntry) => statusEntry._id === 'resolved')?.count || 0) /
          totalComplaints
        ).toFixed(2)
      : '0.00';

    res.status(200).json({
      success: true,
      analytics: {
        totalComplaints,
        statusCounts,
        categoryCounts,
        resolutionRate,
      },
    });
  } catch (error) {
    console.error('Get Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics',
    });
  }
};
