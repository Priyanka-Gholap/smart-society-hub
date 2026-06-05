const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createSociety,
    joinSociety,
    getMySociety
} = require("../controllers/societyController");

router.post(
  "/create",
  authMiddleware,
  createSociety
);

router.post(
  "/join",
  authMiddleware,
  joinSociety
);

router.get(
    "/my-society",
    authMiddleware,
    getMySociety
);

module.exports = router;