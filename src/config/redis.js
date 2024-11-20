const Redis = require("ioredis");
require("dotenv").config();
const { REDIS_TOKEN } = process.env;

const redis = new Redis(`rediss://default:${REDIS_TOKEN}@fun-sheep-20026.upstash.io:6379`);
redis.set("foo", "bar");

module.exports = redis;
