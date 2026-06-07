const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/statistics", statisticsRoutes);

app.use(errorMiddleware);

module.exports = app;