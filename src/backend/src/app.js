const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const novelRoutes = require("./routes/novelRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/novels", novelRoutes);
app.use("/api", chapterRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UZAK backend API is running.",
    data: {
      service: "uzak-backend",
    },
  });
});

module.exports = app;
