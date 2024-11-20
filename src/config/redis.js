const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1", // Замініть, якщо потрібно
  port: 6379,
});

redis.on("error", (err) => console.error("Redis Error:", err));
redis.on("connect", () => console.log("Connected to Redis"));

module.exports = redis;
