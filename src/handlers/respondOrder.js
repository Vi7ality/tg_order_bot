const redis = require("../config/redis");
const { Markup } = require("telegraf");

const respondOrderHandler = async (ctx) => {
  const customerId = ctx.match[1];
  const workerUsername = ctx.from.username;
  const workerId = ctx.update.callback_query.from.id;
  const messageId = ctx.callbackQuery.message.message_id;

  if (workerUsername) {
    try {
      await redis.hset(`order:${customerId}`, "messageId", messageId);

      await ctx.telegram.sendMessage(
        customerId,
        `На ваше замовлення відгукнувся користувач @${workerUsername}. Ви можете підтвердити або відхилити відгук.`,
        Markup.inlineKeyboard([
          Markup.button.callback("✅Підтвердити", `confirm_${customerId}_${workerUsername}`),
          Markup.button.callback("❌Відхилити", `reject_${customerId}_${workerUsername}`),
        ])
      );
      await ctx.telegram.sendMessage(workerId, "✅Ваш відгук відправлено замовнику.");
    } catch (error) {
      console.error("Помилка відправки повідомлення замовнику:", error);
      await ctx.telegram.sendMessage(customerId, "Сталася помилка при відправці відгуку.");
    }
  }
};

module.exports = respondOrderHandler;
