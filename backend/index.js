require("dotenv").config();

const Task = require("./database/models/task");
const express = require("express");
const cors = require("cors");
const sequelize = require("./database/sequelize");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/healthcheck", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "Backend is running",
  });
});

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to database:", error);
  });
