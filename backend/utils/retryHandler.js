/**
 * retryHandler.js
 *
 * NOTE: With Bull + Redis, retry logic is now handled NATIVELY by Bull.
 * In queue.js we configured: { attempts: 3, backoff: { type: "exponential", delay: 2000 } }
 *
 * This means Bull automatically retries failed jobs up to 3 times with
 * exponential backoff (2s → 4s → 8s) — no manual retry code needed.
 *
 * This file is kept for reference / fallback use only.
 */

const retryHandler = async (task) => {
  if (task.retryCount < 3) {
    task.retryCount += 1;
    task.status = "pending";
    await task.save();
    console.log(`[RetryHandler] Task ${task._id} retry #${task.retryCount}`);
  } else {
    task.status = "failed";
    await task.save();
    console.log(`[RetryHandler] Task ${task._id} permanently failed`);
  }
};

export default retryHandler;