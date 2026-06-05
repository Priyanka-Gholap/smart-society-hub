const Society = require("../models/Society");
const User = require("../models/User");
const generateSocietyCode = require("../utils/generateSocietyCode");

const createSociety = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const {
      name,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    console.log("Name:", name);
    console.log("Pincode:", pincode);

    // Basic duplicate check
    const existingSociety = await Society.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      pincode,
    });

    if (existingSociety) {
      return res.status(400).json({
        success: false,
        message: "Society already exists in this pincode",
      });
    }

    const societyCode = generateSocietyCode(
      name,
      pincode
    );

    const society = await Society.create({
      name,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      societyCode,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Society created successfully",
      society,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const joinSociety = async (req, res) => {
  try {
    console.log("JOIN BODY:", req.body);

    const { societyCode, flatNumber } = req.body;

    console.log("Society Code:", societyCode);

    const society = await Society.findOne({
      societyCode,
    });

    console.log("Society Found:", society);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Invalid society code",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        societyId: society._id,
        flatNumber,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Joined society successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMySociety = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.societyId) {
      return res.status(404).json({
        success: false,
        message: "User has not joined any society",
      });
    }

    const society = await Society.findById(
      user.societyId
    );

    res.status(200).json({
      success: true,
      society,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSociety,
  joinSociety,
  getMySociety,
};