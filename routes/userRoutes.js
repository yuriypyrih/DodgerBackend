const express = require("express");
// const userController = require('./../controllers/userController');
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);

// router.route("/").get(userController.getAllUsers);
// router.route("/:id").get(userController.getUser);

module.exports = router;
