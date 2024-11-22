const redis = require("../config/redis");
const { Markup } = require("telegraf");
const { loadGroupId } = require("../services/index");

const publishOrderHandler = async (ctx) => {
  const groupChatId = await loadGroupId();
  const userId = ctx.match[1];

  try {
    const order = await redis.hgetall(`order:${userId}`);

    if (order && order.step === "6") {
      const { role, peopleCount, hours, payment, location, contact } = order;

      if (role && peopleCount && hours && payment && location && contact && groupChatId) {
        await ctx.telegram.sendMessage(
          groupChatId,
          `Нове замовлення:\n\n` +
            `👤 Шукаю: ${role}\n` +
            `👥 Кількість людей: ${peopleCount}\n` +
            `⏳ Годин роботи: ${hours}\n` +
            `💵 Оплата: ${payment} грн/год\n` +
            `📍 Локація: ${location}\n` +
            `📞 Контакт: ${contact}\n\n` +
            `Натисніть кнопку, щоб відгукнутись:`,
          Markup.inlineKeyboard([Markup.button.callback("Відгукнутись", `respond_${userId}`)])
        );
        ctx.editMessageText("Ваше замовлення опубліковано.");
      } else {
        ctx.reply("Замовлення неповне або група не знайдена.");
      }
    } else {
      ctx.reply("Невірний крок або замовлення не знайдено.");
    }
  } catch (error) {
    console.error("Помилка публікації замовлення:", error);
    ctx.reply("Сталася помилка при публікації замовлення.");
  }
};

module.exports = publishOrderHandler;
