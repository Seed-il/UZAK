const jwt = require("jsonwebtoken");

const sendAuthRequired = (res) =>
  res.status(401).json({
    success: false,
    message: "Authorization token is required.",
    error: "AUTH_REQUIRED",
  });

const sendInvalidToken = (res) =>
  res.status(401).json({
    success: false,
    message: "Invalid token.",
    error: "INVALID_TOKEN",
  });

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return sendAuthRequired(res);
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return sendInvalidToken(res);
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }

  try {
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return sendInvalidToken(res);
  }
};

module.exports = authMiddleware;
