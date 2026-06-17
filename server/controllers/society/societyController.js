import Society from '../../models/Society.js';
import User from '../../models/User.js';
import { generateSocietyCode } from '../../utils/generateSocietyCode.js';
import { getDistance } from 'geolib';

// Create Society
export const createSociety = async (req, res) => {
  try {
    const {
      name,
      societyType,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      numberOfBuildings,
      numberOfFlats,
      description,
      contactPerson,
      emergencyContacts,
    } = req.body;

    // Validate required fields
    if (!name || !societyType || !address || !city || !state || !pincode || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check for duplicate society by name and proximity
    const existingSociety = await Society.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });

    if (existingSociety) {
      // Check location proximity (within 1 km)
      const distance = getDistance(
        { latitude: existingSociety.latitude, longitude: existingSociety.longitude },
        { latitude, longitude }
      );

      if (distance < 1000) {
        return res.status(400).json({
          success: false,
          message: 'A society with similar name already exists in this area',
        });
      }
    }

    // Generate unique society code
    const societyCode = generateSocietyCode(name, pincode);

    // Check if code already exists
    const codeExists = await Society.findOne({ societyCode });
    if (codeExists) {
      return res.status(400).json({
        success: false,
        message: 'Generated society code already exists',
      });
    }

    // Create society
    const society = new Society({
      name,
      societyType,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      numberOfBuildings,
      numberOfFlats,
      societyCode,
      admin: req.user._id,
      description,
      contactPerson,
      emergencyContacts: emergencyContacts || [],
    });

    await society.save();

    // Update user role to society_admin
    await User.findByIdAndUpdate(req.user._id, {
      role: 'society_admin',
      society: society._id,
    });

    res.status(201).json({
      success: true,
      message: 'Society created successfully',
      society,
      societyCode: society.societyCode,
    });
  } catch (error) {
    console.error('❌ Create Society Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create society',
    });
  }
};

// Get All Societies
export const getSocieties = async (req, res) => {
  try {
    const { status, city, state, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = city;
    if (state) filter.state = state;

    const skip = (page - 1) * limit;

    const societies = await Society.find(filter)
      .populate('admin', 'firstName lastName email phone')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Society.countDocuments(filter);

    res.status(200).json({
      success: true,
      societies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSocieties: total,
      },
    });
  } catch (error) {
    console.error('❌ Get Societies Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch societies',
    });
  }
};

// Get Society by ID
export const getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id)
      .populate('admin', 'firstName lastName email phone');

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.status(200).json({
      success: true,
      society,
    });
  } catch (error) {
    console.error('❌ Get Society Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch society',
    });
  }
};

// Update Society
export const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, contactPerson, emergencyContacts, disasterModeStatus } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (contactPerson) updateData.contactPerson = contactPerson;
    if (emergencyContacts) updateData.emergencyContacts = emergencyContacts;
    if (disasterModeStatus) updateData.disasterModeStatus = disasterModeStatus;

    const society = await Society.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Society updated successfully',
      society,
    });
  } catch (error) {
    console.error('❌ Update Society Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update society',
    });
  }
};

// Delete Society
export const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findByIdAndDelete(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Society deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Society Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete society',
    });
  }
};

// Join Society
export const joinSociety = async (req, res) => {
  try {
    const { societyCode, flat, building } = req.body;

    if (!societyCode) {
      return res.status(400).json({
        success: false,
        message: 'Society code is required',
      });
    }

    const society = await Society.findOne({ societyCode });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Invalid society code',
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        society: society._id,
        flat,
        building,
        isVerified: false,
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Joined society successfully',
      user: updatedUser,
      society,
    });
  } catch (error) {
    console.error('❌ Join Society Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to join society',
    });
  }
};

// Get Society Members
export const getSocietyMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, page = 1, limit = 20 } = req.query;

    const filter = { society: id };
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const members = await User.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password')
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      members,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMembers: total,
      },
    });
  } catch (error) {
    console.error('❌ Get Members Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch members',
    });
  }
};

// Get Society Statistics
export const getSocietyStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    const totalResidents = await User.countDocuments({
      society: id,
      role: 'resident',
    });

    res.status(200).json({
      success: true,
      statistics: {
        ...society.statistics,
        totalResidents,
      },
    });
  } catch (error) {
    console.error('❌ Get Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics',
    });
  }
};

// Approve Society (Super Admin)
export const approveSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const society = await Society.findByIdAndUpdate(
      id,
      {
        status,
        isVerified: status === 'approved',
      },
      { new: true }
    );

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Society ${status} successfully`,
      society,
    });
  } catch (error) {
    console.error('❌ Approve Society Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve society',
    });
  }
};
