const mongoose = require("mongoose");
const Task = require("../models/Task");

// Validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? String(description).trim() : "",
      status: status || "pending",
      dueDate: dueDate || null,
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, error: error.message });
    }
    console.error("createTask error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("getTasks error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("getTask error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    const { title, description, status, dueDate } = req.body;
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (dueDate !== undefined) updateFields.dueDate = dueDate || null;

    const task = await Task.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, error: error.message });
    }
    console.error("updateTask error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.status(200).json({ success: true, message: "Task deleted", data: { id } });
  } catch (error) {
    console.error("deleteTask error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
