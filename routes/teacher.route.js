const express = require("express");
const authController = require("../controllers/teacher.controller");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/", verifyToken, (req, res) => {
  console.log("req.cookies", req.cookies);
  res.json({
    message: "Welcome to your dashboard teachers!",
    user: req.user, // Returns user details from token
  });
});
module.exports = router;
