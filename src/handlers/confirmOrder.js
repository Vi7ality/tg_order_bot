const redis = require("../config/redis");
const { loadGroupId } = require("../services/index");

let groupChatId = loadGroupId();

const confirmOrderHandler = async (ctx) => {
  const [data] = ctx.match.slice(1);
  const [userId, workerUsername] = data.split("_");

  try {
    const orderDetails = await redis.hgetall(`order:${userId}`);
    const messageId = orderDetails.messageId;

    if (!messageId || !groupChatId) {
      throw new Error("Дані про замовлення або групу відсутні.");
    }

    const updatedOrderText =
      `Нове замовлення:\n\n` +
      `${orderDetails.role ? `👤 Шукаю: ${orderDetails.role}\n` : ""}` +
      `${orderDetails.peopleCount ? `👥 Кількість людей: ${orderDetails.peopleCount}\n` : ""}` +
      `${orderDetails.hours ? `⏳ Годин роботи: ${orderDetails.hours}\n` : ""}` +
      `${orderDetails.payment ? `💵 Оплата: ${orderDetails.payment} грн/год\n` : ""}` +
      `${orderDetails.location ? `📍 Локація: ${orderDetails.location}\n` : ""}` +
      `${orderDetails.contact ? `📞 Контакт: ${orderDetails.contact}\n` : ""}\n` +
      `Замовлення закрито.`;

    await ctx.telegram.editMessageText(groupChatId, messageId, null, updatedOrderText);

    await ctx.editMessageText(
      `✅Відгук користувача @${workerUsername} підтверджено. Замовлення закрито.`
    );
    await redis.del(`order:${userId}`);
  } catch (error) {
    console.error("Помилка підтвердження відгуку:", error);
    await ctx.reply("Сталася помилка при підтвердженні замовлення.");
  }
};

module.exports = confirmOrderHandler;
