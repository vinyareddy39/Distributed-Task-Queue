/**
 * queue.js — Shared Bull Queue Instance
 *
 * Supports two Redis connection modes:
 *   1. REDIS_URL (Upstash / cloud Redis) — used in production
 *   2. REDIS_HOST + REDIS_PORT          — used locally
 */

import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

let redisConfig;

if (process.env.REDIS_URL) {
  // Cloud Redis (Upstash) — connection URL like rediss://default:password@host:port
  redisConfig = process.env.REDIS_URL;
} else {
  // Local Redis
  redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT) || 6379,
  };
}

const taskQueue = new Bull("taskQueue", {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: false,
    removeOnFail: false,
  },
});

// Queue-level event listeners
taskQueue.on("error", (err) => {
  console.error("[Queue] Error:", err.message);
});

taskQueue.on("waiting", (jobId) => {
  console.log(`[Queue] Job #${jobId} waiting in queue`);
});

taskQueue.on("active", (job) => {
  console.log(`[Queue] Job #${job.id} started — Task: ${job.data.taskId}`);
});

taskQueue.on("completed", (job) => {
  console.log(`[Queue] Job #${job.id} completed — Task: ${job.data.taskId}`);
});

taskQueue.on("failed", (job, err) => {
  console.error(`[Queue] Job #${job.id} failed — ${err.message}`);
});

export default taskQueue;
