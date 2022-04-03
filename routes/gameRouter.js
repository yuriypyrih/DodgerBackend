const express = require("express");
const gameController = require("./../controllers/gameController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes from this point on
router.use(authController.protect);

router.post("/unlockLevel", gameController.unlockLevel);
router.post("/beatLevel", gameController.beatLevel);
router.post("/unlockRelic", gameController.unlockRelic);
router.post("/selectRelic", gameController.selectRelic);

module.exports = router;
