require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./database/sequelize");
const Task = require("./database/models/task");

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

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error listing tasks:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title,
      completed: false,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.update({
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      completed: completed !== undefined ? completed : task.completed,
    });

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

sequelize
  .sync()
  .then(() => {
    console.log("Database connected and synced");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to database:", error);
  });
