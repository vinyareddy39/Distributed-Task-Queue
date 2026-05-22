import express from "express";
import Bull from "bull";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import Task from "../models/Task.js";

import verifyToken from "../utils/verifyToken.js";

import emailWorker from "../workers/emailWorker.js";
import imageWorker from "../workers/imageWorker.js";
import reportWorker from "../workers/reportWorker.js";

import retryHandler from "../utils/retryHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });


// Queue

const useRedis = process.env.USE_REDIS === "true";
let taskQueue = null;

if (useRedis) {
  taskQueue = new Bull("taskQueue", {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });
}


// Create Task

router.post("/task", verifyToken, upload.single("image"), async (req, res) => {

  try {

    const { taskType, data } = req.body;

    let taskData = data;

    // If data is sent as JSON string (from FormData), parse it
    if (typeof taskData === "string") {
      try { taskData = JSON.parse(taskData); } catch { taskData = {}; }
    }

    // For image tasks, use the uploaded file info
    if (taskType === "image" && req.file) {
      taskData = {
        imageName: req.file.originalname,
        imagePath: `/uploads/${req.file.filename}`,
      };
    }

    const task = await Task.create({
      taskType,
      data: taskData || {},
    });

    if (useRedis && taskQueue) {
      await taskQueue.add({
        taskId: task._id,
      });
    } else {
      // Process task immediately in background if Redis is disabled/down
      setTimeout(async () => {
        try {
          const freshTask = await Task.findById(task._id);
          if (!freshTask) return;

          freshTask.status = "processing";
          await freshTask.save();

          if (freshTask.taskType === "email") {
            await emailWorker(freshTask);
          } else if (freshTask.taskType === "image") {
            await imageWorker(freshTask);
          } else if (freshTask.taskType === "report") {
            await reportWorker(freshTask);
          }

          freshTask.status = "completed";
          await freshTask.save();

        } catch (error) {
          const freshTask = await Task.findById(task._id);
          if (freshTask) {
            await retryHandler(freshTask);
          }
        }
      }, 1000);
    }

    res.status(201).json({
      message: "Task Added Successfully",
      task,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});


// Get All Tasks

router.get("/tasks", verifyToken, async (req, res) => {

  try {

    const tasks = await Task.find();

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});


// Get Single Task

router.get("/task/:id", verifyToken, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    res.json(task);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});


// Worker Processing

if (useRedis && taskQueue) {
  taskQueue.process(async (job) => {
    const task = await Task.findById(job.data.taskId);
    try {
      task.status = "processing";
      await task.save();

      if (task.taskType === "email") {
        await emailWorker(task);
      } else if (task.taskType === "image") {
        await imageWorker(task);
      } else if (task.taskType === "report") {
        await reportWorker(task);
      }

      task.status = "completed";
      await task.save();
    } catch (error) {
      await retryHandler(task);
    }
  });
}

// Delete Task
router.delete("/task/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Task
router.patch("/task/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { taskType, data } = req.body;
    const updates = {};

    if (taskType) updates.taskType = taskType;

    if (taskType === "image" && req.file) {
      updates.data = {
        imageName: req.file.originalname,
        imagePath: `/uploads/${req.file.filename}`,
      };
    } else if (data) {
      let parsedData = data;
      if (typeof parsedData === "string") {
        try { parsedData = JSON.parse(parsedData); } catch { parsedData = {}; }
      }
      updates.data = parsedData;
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;