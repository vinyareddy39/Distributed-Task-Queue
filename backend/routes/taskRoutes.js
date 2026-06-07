/**
 * taskRoutes.js — API Server Routes
 *
 * The API server's ONLY job regarding tasks:
 *   1. Receive the HTTP request
 *   2. Save the task to MongoDB (status: "pending")
 *   3. Add a job to the Bull/Redis queue
 *   4. Immediately respond to the user — does NOT wait for processing
 *
 * The actual processing happens in worker.js (separate process).
 *
 * This is the Producer side of the Producer → Queue → Consumer pattern.
 */

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import Task from "../models/Task.js";
import verifyToken from "../utils/verifyToken.js";
import taskQueue from "../queue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ─── Multer (image upload to disk) ───────────────────────────────────────────
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


// ─── POST /task — Create a new task & enqueue it ─────────────────────────────
router.post("/task", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { taskType, data } = req.body;

    let taskData = data;

    // Parse JSON string (from FormData)
    if (typeof taskData === "string") {
      try { taskData = JSON.parse(taskData); } catch { taskData = {}; }
    }

    // For image tasks, store the uploaded file path
    if (taskType === "image" && req.file) {
      taskData = {
        imageName: req.file.originalname,
        imagePath: `/uploads/${req.file.filename}`,
      };
    }

    // 1. Save task to MongoDB with status "pending"
    const task = await Task.create({
      userId: req.user.id,
      taskType,
      data: taskData || {},
      status: "pending",
    });

    // 2. Add job to Bull/Redis queue — worker.js will pick this up
    const job = await taskQueue.add(
      { taskId: task._id.toString() },
      {
        jobId: task._id.toString(), // use task ID as job ID for traceability
      }
    );

    console.log(`[API] Task ${task._id} (${taskType}) queued as Job #${job.id}`);

    // 3. Respond immediately — don't wait for processing
    res.status(201).json({
      message: "Task added to queue successfully",
      task,
      jobId: job.id,
    });

  } catch (error) {
    console.error("[API] Create task error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// ─── GET /tasks — Get all tasks for logged-in user ───────────────────────────
router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ─── GET /task/:id — Get single task ─────────────────────────────────────────
router.get("/task/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to task" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ─── DELETE /task/:id — Delete a task ────────────────────────────────────────
router.delete("/task/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete task" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ─── PATCH /task/:id — Update a task ─────────────────────────────────────────
router.patch("/task/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update task" });
    }

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

    // Reset status to pending and re-queue on edit
    updates.status = "pending";
    updates.retryCount = 0;

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Re-add to queue so worker re-processes the updated task
    await taskQueue.add(
      { taskId: updated._id.toString() },
      { jobId: `${updated._id.toString()}-${Date.now()}` }
    );
    console.log(`[API] Task ${updated._id} updated and re-queued`);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ─── GET /queue/status — Queue stats (bonus endpoint) ────────────────────────
router.get("/queue/status", verifyToken, async (req, res) => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      taskQueue.getWaitingCount(),
      taskQueue.getActiveCount(),
      taskQueue.getCompletedCount(),
      taskQueue.getFailedCount(),
      taskQueue.getDelayedCount(),
    ]);

    res.json({
      queue: "taskQueue",
      broker: "Redis (Bull)",
      counts: { waiting, active, completed, failed, delayed },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;