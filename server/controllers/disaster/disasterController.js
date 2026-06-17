import Alert from '../../models/Alert.js';
import SafetyStatus from '../../models/SafetyStatus.js';
import SOS from '../../models/SOS.js';
import Shelter from '../../models/Shelter.js';
import Resource from '../../models/Resource.js';
import Volunteer from '../../models/Volunteer.js';
import Society from '../../models/Society.js';
import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Create Alert
export const createAlert = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      level,
      affectedAreas,
      recommendedActions,
      location,
      resourcesNeeded,
      estimatedDuration,
    } = req.body;

    const alert = new Alert({
      title,
      description,
      type,
      level,
      society: req.user.society,
      issuedBy: req.user._id,
      affectedAreas: affectedAreas || [],
      recommendedActions: recommendedActions || [],
      location,
      resourcesNeeded: resourcesNeeded || [],
      estimatedDuration,
    });

    await alert.save();

    await Society.findByIdAndUpdate(req.user.society, {
      disasterModeEnabled: true,
      disasterModeStatus: level === 'critical' ? 'critical' : 'active',
      $inc: { 'statistics.activeAlerts': 1 },
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`society_${req.user.society}`).emit('emergency_alert', {
        alert,
        notification: {
          title: `${type.toUpperCase()} ALERT`,
          message: description,
          level,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Alert created and broadcasted',
      alert,
    });
  } catch (error) {
    console.error('Create Alert Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create alert',
    });
  }
};

// Get Alerts
export const getAlerts = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const filter = { society: req.user.society };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (page - 1) * limit;

    const alerts = await Alert.find(filter)
      .populate('issuedBy', 'firstName lastName')
      .limit(parseInt(limit, 10))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Alert.countDocuments(filter);

    res.status(200).json({
      success: true,
      alerts,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get Alerts Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch alerts',
    });
  }
};

// Activate Disaster Mode
export const activateDisasterMode = async (req, res) => {
  try {
    const { reason, affectedAreas } = req.body;

    const society = await Society.findByIdAndUpdate(
      req.user.society,
      {
        disasterModeEnabled: true,
        disasterModeStatus: 'active',
      },
      { new: true }
    );

    const alert = new Alert({
      title: 'DISASTER MODE ACTIVATED',
      description: reason || 'Disaster mode activated for emergency management',
      type: 'other',
      level: 'critical',
      society: req.user.society,
      issuedBy: req.user._id,
      affectedAreas: affectedAreas || [],
      status: 'active',
    });

    await alert.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`society_${req.user.society}`).emit('disaster_mode_activated', {
        society,
        alert,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disaster mode activated',
      society,
      alert,
    });
  } catch (error) {
    console.error('Activate Disaster Mode Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to activate disaster mode',
    });
  }
};

// Deactivate Disaster Mode
export const deactivateDisasterMode = async (req, res) => {
  try {
    const society = await Society.findByIdAndUpdate(
      req.user.society,
      {
        disasterModeEnabled: false,
        disasterModeStatus: 'inactive',
      },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`society_${req.user.society}`).emit('disaster_mode_deactivated', {
        society,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disaster mode deactivated',
      society,
    });
  } catch (error) {
    console.error('Deactivate Disaster Mode Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deactivate disaster mode',
    });
  }
};

// Submit SOS
export const submitSOS = async (req, res) => {
  try {
    const { type, severity, location = {}, description } = req.body;

    const sos = new SOS({
      resident: req.user._id,
      society: req.user.society,
      type,
      severity,
      location: {
        ...location,
        latitude: location.latitude || req.body.latitude,
        longitude: location.longitude || req.body.longitude,
      },
      description,
      status: 'active',
    });

    await sos.save();

    const io = req.app.get('io');

    try {
      const riskResponse = await axios.post(`${ML_SERVICE_URL}/api/calculate-risk`, {
        type,
        severity,
        complaints: [],
      });

      if (io) {
        io.to(`society_${req.user.society}`).emit('sos_emergency', {
          sos,
          riskScore: riskResponse.data.riskScore,
        });
      }
    } catch (error) {
      console.log('ML service unavailable');
      if (io) {
        io.to(`society_${req.user.society}`).emit('sos_emergency', { sos });
      }
    }

    res.status(201).json({
      success: true,
      message: 'SOS submitted, help is on the way',
      sos,
    });
  } catch (error) {
    console.error('SOS Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit SOS',
    });
  }
};

// Update Safety Status
export const updateSafetyStatus = async (req, res) => {
  try {
    const { status, location = {}, description, emergencyDetails } = req.body;

    const safetyStatus = new SafetyStatus({
      resident: req.user._id,
      society: req.user.society,
      status,
      location: {
        ...location,
        latitude: location.latitude || req.body.latitude,
        longitude: location.longitude || req.body.longitude,
      },
      description,
      emergencyDetails,
    });

    await safetyStatus.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`society_${req.user.society}`).emit('safety_status_update', {
        resident: {
          id: req.user._id,
          name: `${req.user.firstName} ${req.user.lastName}`,
        },
        status,
        location,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Safety status updated',
      safetyStatus,
    });
  } catch (error) {
    console.error('Update Safety Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update safety status',
    });
  }
};

// Get Safety Status
export const getSafetyStatus = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { society: req.user.society };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const safetyStatusList = await SafetyStatus.find(filter)
      .populate('resident', 'firstName lastName')
      .limit(parseInt(limit, 10))
      .skip(skip)
      .sort({ updatedAt: -1 });

    const summary = await SafetyStatus.aggregate([
      { $match: { society: req.user.society } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      safetyStatusList,
      summary,
    });
  } catch (error) {
    console.error('Get Safety Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch safety status',
    });
  }
};

// Create Shelter
export const createShelter = async (req, res) => {
  try {
    const {
      name,
      type,
      capacity,
      location,
      contactPerson,
      facilities,
      amenities,
    } = req.body;

    const shelter = new Shelter({
      name,
      society: req.user.society,
      type,
      capacity,
      location,
      contactPerson,
      facilities: facilities || [],
      amenities: amenities || [],
    });

    await shelter.save();

    res.status(201).json({
      success: true,
      message: 'Shelter created successfully',
      shelter,
    });
  } catch (error) {
    console.error('Create Shelter Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create shelter',
    });
  }
};

// Get Shelters
export const getShelters = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = { society: req.user.society, isActive: true };
    if (type) filter.type = type;

    const shelters = await Shelter.find(filter);

    res.status(200).json({
      success: true,
      shelters,
    });
  } catch (error) {
    console.error('Get Shelters Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch shelters',
    });
  }
};

// Add Resource
export const addResource = async (req, res) => {
  try {
    const { type, name, quantity, location, status } = req.body;

    const resource = new Resource({
      society: req.user.society,
      type,
      name,
      quantity,
      location,
      status: status || 'available',
      responsiblePerson: req.user._id,
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource added successfully',
      resource,
    });
  } catch (error) {
    console.error('Add Resource Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add resource',
    });
  }
};

// Get Resources
export const getResources = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;

    const filter = { society: req.user.society };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const resources = await Resource.find(filter)
      .limit(parseInt(limit, 10))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(filter);

    res.status(200).json({
      success: true,
      resources,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get Resources Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch resources',
    });
  }
};

// Register Volunteer
export const registerVolunteer = async (req, res) => {
  try {
    const { specialization, availability, certifications, languages } = req.body;

    const volunteer = new Volunteer({
      user: req.user._id,
      society: req.user.society,
      specialization,
      availability,
      certifications: certifications || [],
      languages: languages || [],
      isActive: true,
    });

    await volunteer.save();

    await Society.findByIdAndUpdate(req.user.society, {
      $inc: { 'statistics.volunteers': 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Registered as volunteer successfully',
      volunteer,
    });
  } catch (error) {
    console.error('Register Volunteer Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register as volunteer',
    });
  }
};

// Get Volunteers
export const getVolunteers = async (req, res) => {
  try {
    const { specialization, availability, page = 1, limit = 10 } = req.query;

    const filter = { society: req.user.society, isActive: true };
    if (specialization) filter.specialization = specialization;
    if (availability) filter.availability = availability;

    const skip = (page - 1) * limit;

    const volunteers = await Volunteer.find(filter)
      .populate('user', 'firstName lastName phone email')
      .limit(parseInt(limit, 10))
      .skip(skip);

    const total = await Volunteer.countDocuments(filter);

    res.status(200).json({
      success: true,
      volunteers,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get Volunteers Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch volunteers',
    });
  }
};
