const redis = require("../config/redis");

const orderInitHandler = async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    await redis.hset(`order:${userId}`, "step", 1);
    ctx.reply("Вкажіть, кого ви шукаєте?");
  } catch (error) {
    console.error("Помилка створення запиту:", error);
  }
};

module.exports = orderInitHandler;
