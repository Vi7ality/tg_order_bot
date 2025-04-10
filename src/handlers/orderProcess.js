const redis = require("../config/redis");
const { Markup } = require("telegraf");

const orderProcessHandler = async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const order = await redis.hgetall(`order:${userId}`);

    if (order) {
      const step = parseInt(order.step, 10);

      switch (step) {
        case 1:
          await redis.hset(`order:${userId}`, "role", ctx.message.text, "step", 2);
          ctx.reply("Вкажіть кількість людей:");
          break;

        case 2:
          if (!isNaN(ctx.message.text)) {
            await redis.hset(`order:${userId}`, "peopleCount", ctx.message.text, "step", 3);
            ctx.reply("Скільки годин роботи?");
          } else {
            ctx.reply("Будь ласка, введіть числове значення.");
          }
          break;

        case 3:
          if (!isNaN(ctx.message.text)) {
            await redis.hset(`order:${userId}`, "hours", ctx.message.text, "step", 4);
            ctx.reply("Вкажіть оплату (від 100 грн/год):");
          } else {
            ctx.reply("Будь ласка, введіть числове значення.");
          }
          break;

        case 4:
          await redis.hset(`order:${userId}`, "payment", ctx.message.text, "step", 5);
          ctx.reply("Вкажіть місце роботи (локацію):");
          break;

        case 5:
          await redis.hset(`order:${userId}`, "location", ctx.message.text, "step", 6);
          ctx.reply("Вкажіть ваш номер телефону або нік у Telegram:");
          break;

        case 6:
          await redis.hset(`order:${userId}`, "contact", ctx.message.text);
          const finalOrder = await redis.hgetall(`order:${userId}`);

          ctx.reply(
            `Перевірте деталі вашого замовлення:\n\n` +
              `👤 Шукаю: ${finalOrder.role}\n` +
              `👥 Кількість людей: ${finalOrder.peopleCount}\n` +
              `⏳ Годин роботи: ${finalOrder.hours}\n` +
              `💵 Оплата: ${finalOrder.payment} грн/год\n` +
              `📍 Локація: ${finalOrder.location}\n` +
              `📞 Контакт: ${finalOrder.contact}`,
            Markup.inlineKeyboard([[Markup.button.callback("✅ Оприлюднити", `publish_${userId}`)]])
          );
          break;

        default:
          ctx.reply("Щось пішло не так. Почніть спочатку.");
          await redis.del(`order:${userId}`);
          break;
      }
    }
  } catch (error) {
    console.error("Помилка створення запиту:", error);
  }
};

module.exports = orderProcessHandler;
