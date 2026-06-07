import Bull from "bull";
import dotenv from "dotenv";

dotenv.config();

let redisConfig;

if (process.env.REDIS_URL) {
  redisConfig = {
    tls: {},
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    password: undefined,
  };

  redisConfig = process.env.REDIS_URL;
} else {
  redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT) || 6379,
  };
}

const taskQueue = new Bull("taskQueue", {
  redis: process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL,
        tls: {},
      }
    : redisConfig,
});
export default taskQueue;
