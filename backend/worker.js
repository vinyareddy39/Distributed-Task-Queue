/**
 * worker.js — Standalone Worker Node
 *
 * This is a SEPARATE process from the API server (server.js).
 * Run it with:  node worker.js
 *
 * You can run MULTIPLE instances of this file to scale workers:
 *   Terminal 1: node worker.js   ← Worker Node 1
 *   Terminal 2: node worker.js   ← Worker Node 2
 *   Terminal 3: node worker.js   ← Worker Node 3
 *
 * Architecture:
 *   [API Server] → adds job to Redis queue
 *   [Worker 1]  ┐
 *   [Worker 2]  ├── pulls jobs from Redis queue & processes them
 *   [Worker 3]  ┘
 *
 * Concepts demonstrated:
 *   - Asynchronous processing (API doesn't wait for task to finish)
 *   - Worker nodes (independent processes)
 *   - Fault tolerance (Bull retries on failure with exponential backoff)
 *   - Distributed processing (multiple workers share the same queue)
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import taskQueue from "./queue.js";
import Task from "./models/Task.js";
import emailWorker from "./workers/emailWorker.js";
import imageWorker from "./workers/imageWorker.js";
import reportWorker from "./workers/reportWorker.js";

const WORKER_ID = `Worker-${process.pid}`; // unique ID per worker process

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`[${WORKER_ID}] MongoDB connected`);
    console.log(`[${WORKER_ID}] Listening for jobs on queue "taskQueue"...`);
  })
  .catch((err) => {
    console.error(`[${WORKER_ID}] MongoDB connection failed:`, err.message);
    process.exit(1);
  });

// ─── Process Jobs from the Queue ─────────────────────────────────────────────
// Bull automatically distributes jobs across all running workers.
// Only ONE worker picks up each job (competing consumers pattern).
taskQueue.process(async (job) => {
  const { taskId } = job.data;
  console.log(`[${WORKER_ID}] Picked up Job #${job.id} — Task: ${taskId}`);

  // Fetch the task document from MongoDB
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error(`Task ${taskId} not found in database`);
  }

  // Mark as processing
  task.status = "processing";
  await task.save();
  console.log(`[${WORKER_ID}] Task ${taskId} (${task.taskType}) → processing`);

  // Route to the correct worker based on task type
  switch (task.taskType) {
    case "email":
      await emailWorker(task);
      break;
    case "image":
      await imageWorker(task);
      break;
    case "report":
      await reportWorker(task);
      break;
    default:
      throw new Error(`Unknown task type: ${task.taskType}`);
  }

  // Mark as completed
  task.status = "completed";
  task.retryCount = job.attemptsMade; // track how many attempts it took
  await task.save();
  console.log(`[${WORKER_ID}] Task ${taskId} → completed ✓`);
});

// ─── Handle job failures (Bull calls this after all retries exhausted) ────────
taskQueue.on("failed", async (job, err) => {
  const { taskId } = job.data;
  console.error(`[${WORKER_ID}] Job #${job.id} FAILED permanently: ${err.message}`);

  // If all retries exhausted, mark task as failed in DB
  if (job.attemptsMade >= job.opts.attempts) {
    try {
      const task = await Task.findById(taskId);
      if (task) {
        task.status = "failed";
        task.retryCount = job.attemptsMade;
        await task.save();
        console.log(`[${WORKER_ID}] Task ${taskId} marked as failed after ${job.attemptsMade} attempts`);
      }
    } catch (e) {
      console.error(`[${WORKER_ID}] Could not update failed task:`, e.message);
    }
  }
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on("SIGTERM", async () => {
  console.log(`[${WORKER_ID}] Shutting down gracefully...`);
  await taskQueue.close();
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log(`[${WORKER_ID}] Shutting down gracefully...`);
  await taskQueue.close();
  await mongoose.connection.close();
  process.exit(0);
});
