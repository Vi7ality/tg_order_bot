const { loadGroupId } = require("../services/index");

let groupChatId = loadGroupId();

const rejectOrderHandler = async (ctx) => {
  const [userId, workerUsername] = data.split("_");
  try {
    ctx.editMessageText(`❌Відгук користувача @${workerUsername} відхилено.`);
  } catch (error) {
    console.error("Помилка відхилення відгуку:", error);
    ctx.reply("Сталася помилка при відхиленні замовлення.");
  }
};

module.exports = rejectOrderHandler;
