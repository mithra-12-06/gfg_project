const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const seedDefaultAdmin = require("./seedAdmin");

dotenv.config();

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowedPatterns = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,
      ];

      const explicitOrigin = process.env.CLIENT_URL;
      const isAllowed =
        (explicitOrigin && origin === explicitOrigin) ||
        allowedPatterns.some((pattern) => pattern.test(origin));

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
