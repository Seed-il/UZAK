const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const VALID_ROLES = ["reader", "writer"];
const SALT_ROUNDS = 10;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildUserResponse = (user) => ({
  id: user._id.toString(),
  email: user.email,
  nickname: user.nickname,
  role: user.role,
});

const sendInvalidCredentials = (res) =>
  res.status(401).json({
    success: false,
    message: "Invalid email or password.",
    error: "INVALID_CREDENTIALS",
  });

const register = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const nickname = typeof req.body.nickname === "string" ? req.body.nickname.trim() : "";
    const role = typeof req.body.role === "string" ? req.body.role.trim() : "";

    if (!email || !password || !nickname || !role) {
      return res.status(400).json({
        success: false,
        message: "email, password, nickname, and role are required.",
        error: "VALIDATION_ERROR",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
        error: "VALIDATION_ERROR",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "password must be at least 8 characters.",
        error: "VALIDATION_ERROR",
      });
    }

    if (nickname.length < 2) {
      return res.status(400).json({
        success: false,
        message: "nickname must be at least 2 characters.",
        error: "VALIDATION_ERROR",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'role must be either "reader" or "writer".',
        error: "VALIDATION_ERROR",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "email already exists.",
        error: "EMAIL_ALREADY_EXISTS",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password: hashedPassword,
      nickname,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration completed.",
      data: {
        user: buildUserResponse(user),
      },
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({
        success: false,
        message: "email already exists.",
        error: "EMAIL_ALREADY_EXISTS",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

const login = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required.",
        error: "VALIDATION_ERROR",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendInvalidCredentials(res);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendInvalidCredentials(res);
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured.",
        error: "INTERNAL_SERVER_ERROR",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: buildUserResponse(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        error: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      data: {
        user: buildUserResponse(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

module.exports = {
  getMe,
  login,
  register,
};
