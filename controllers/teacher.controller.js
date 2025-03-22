const Teacher = require("../models/teacher.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Teacher already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Teacher({ userName, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher)
      return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(teacher._id);
    const refreshToken = generateRefreshToken(teacher._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.json({ message: "Logged in successfully", accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token provided, please login" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Refresh token expired, please login again" });
        }
        const newAccessToken = generateAccessToken(decoded.userId);
        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};
