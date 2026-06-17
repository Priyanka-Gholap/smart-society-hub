import Society from '../models/Society.js';
import User from '../models/User.js';

// Generate Society Code
const generateSocietyCode = (name, pincode) => {
  const namePrefix = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, 'A');
  const randomDigits = Math.floor(Math.random() * 900) + 100;
  const pincodePrefix = pincode.slice(-2).toUpperCase();
  return `${namePrefix}${randomDigits}${pincodePrefix}`;
};

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
      amenities
    } = req.body;

    // Validation
    if (!name || !societyType || !address || !city || !state || !pincode || 
        latitude === undefined || longitude === undefined || 
        !numberOfBuildings || !numberOfFlats) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        required: ['name', 'societyType', 'address', 'city', 'state', 'pincode', 'latitude', 'longitude', 'numberOfBuildings', 'numberOfFlats']
      });
    }

    // Check duplicate
    const existingSociety = await Society.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      pincode
    });

    if (existingSociety) {
      return res.status(400).json({
        success: false,
        message: 'Society with this name already exists in this pincode'
      });
    }

    // Generate society code
    const societyCode = generateSocietyCode(name, pincode);

    // Create society
    const society = await Society.create({
      name,
      societyType,
      address,
      city,
      state,
      pincode,

      latitude: Number(latitude),
      longitude: Number(longitude),

      location: {
        type: 'Point',
        coordinates: [
        Number(longitude),
        Number(latitude)
      ]
    },

  numberOfBuildings: Number(numberOfBuildings),
  numberOfFlats: Number(numberOfFlats),

  description: description || '',
  amenities: amenities || [],

  admin: req.user._id,

  status: 'approved',
  isVerified: true,

  societyCode
});

    // Update user to be society admin
    await User.findByIdAndUpdate(req.user._id, {
      society: society._id,
      role: 'society_admin'
    });

    res.status(201).json({
      success: true,
      message: 'Society created successfully',
      society: {
        id: society._id,
        name: society.name,
        societyCode: society.societyCode,
        address: society.address,
        city: society.city,
        state: society.state,
        latitude: society.latitude,
        longitude: society.longitude
      }
    });
  } catch (error) {
    console.error('Create society error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create society'
    });
  }
};

export const searchSocieties = async (req, res) => {
  try {

    const { query = '' } = req.query;

    const societies = await Society.find({
      name: {
        $regex: query,
        $options: 'i'
      },
      status: 'approved'
    });

    res.status(200).json({
      success: true,
      societies
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMySociety = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .populate('society');

    if (!user.society) {
      return res.status(404).json({
        success: false,
        message: 'No society found'
      });
    }

    res.status(200).json({
      success: true,
      society: user.society
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Get All Societies
export const getSocieties = async (req, res) => {
  try {
    const { page = 1, limit = 10, city, state } = req.query;

    const filter = { status: 'approved' };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (state) filter.state = { $regex: state, $options: 'i' };

    const skip = (page - 1) * limit;

    const societies = await Society.find(filter)
      .select('name address city state pincode latitude longitude numberOfFlats amenities')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Society.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: societies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get societies error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch societies'
    });
  }
};

// Get Society By ID
export const getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id)
      .populate('admin', 'firstName lastName email phone');

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    res.status(200).json({
      success: true,
      society
    });
  } catch (error) {
    console.error('Get society error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch society'
    });
  }
};

export const getNearby = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required'
      });
    }

    const societies = await Society.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              Number(longitude),
              Number(latitude)
            ]
          },
          $maxDistance: Number(radius) * 1000
        }
      },
      status: 'approved'
    });

    res.status(200).json({
      success: true,
      count: societies.length,
      societies
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Society
export const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, amenities, numberOfFlats, emergencyContacts } = req.body;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    // Check authorization
    if (society.admin.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this society'
      });
    }

    // Update fields
    if (name) society.name = name;
    if (description) society.description = description;
    if (amenities) society.amenities = amenities;
    if (numberOfFlats) society.numberOfFlats = numberOfFlats;
    if (emergencyContacts) society.emergencyContacts = emergencyContacts;

    await society.save();

    res.status(200).json({
      success: true,
      message: 'Society updated successfully',
      society
    });
  } catch (error) {
    console.error('Update society error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update society'
    });
  }
};

// Delete Society
export const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    // Check authorization
    if (society.admin.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this society'
      });
    }

    await Society.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Society deleted successfully'
    });
  } catch (error) {
    console.error('Delete society error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete society'
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
        message: 'Society code is required'
      });
    }

    const society = await Society.findOne({ societyCode });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Invalid society code'
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        society: society._id,
        flat: flat || '',
        building: building || '',
        role: 'resident'
      },
      { new: true }
    ).populate('society', 'name societyCode address city');

    res.status(200).json({
      success: true,
      message: 'Joined society successfully',
      user
    });
  } catch (error) {
    console.error('Join society error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to join society'
    });
  }
};

// Get Society Members
export const getSocietyMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    const skip = (page - 1) * limit;

    const members = await User.find({ society: id })
      .select('firstName lastName email phone role flat building')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({ society: id });

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch members'
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
        message: 'Society not found'
      });
    }

    const totalMembers = await User.countDocuments({ society: id });

    res.status(200).json({
      success: true,
      statistics: {
        totalResidents: totalMembers,
        totalComplaints: society.statistics.totalComplaints,
        resolvedComplaints: society.statistics.resolvedComplaints,
        activeAlerts: society.statistics.activeAlerts,
        volunteers: society.statistics.volunteers,
        numberOfFlats: society.numberOfFlats,
        numberOfBuildings: society.numberOfBuildings,
        amenities: society.amenities
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics'
    });
  }
};

// Approve Society (Super Admin Only)
export const approveSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const society = await Society.findByIdAndUpdate(
      id,
      { status, isVerified: status === 'approved' },
      { new: true }
    );

    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Society ${status} successfully`,
      society
    });
  } catch (error) {
    console.error('Approve society error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve society'
    });
  }
};
