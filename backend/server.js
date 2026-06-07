import Bull from "bull";
import dotenv from "dotenv";

dotenv.config();

let redisConfig;

if (process.env.REDIS_URL) {
  const redisUrl = new URL(process.env.REDIS_URL);

  redisConfig = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    password: redisUrl.password,
    tls: {},
  };
} else {
  redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
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
  },
});

export default taskQueue;