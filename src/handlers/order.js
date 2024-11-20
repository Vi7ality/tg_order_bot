const { Markup } = require("telegraf");

const orderInitHandler = async (ctx) => {
  try {
    const userId = ctx.from.id;
    userOrders[userId] = { step: 1 };
    ctx.reply("Вкажіть, кого ви шукаєте?");
  } catch (error) {
    console.error("Помилка створення запиту");
  }
};

const orderCreateHandler = async (ctx) => {
  try {
    const userId = ctx.from.id;

    if (userOrders[userId]) {
      const order = userOrders[userId];

      switch (order.step) {
        case 1:
          order.role = ctx.message.text;
          order.step++;
          ctx.reply("Вкажіть кількість людей:");
          break;

        case 2:
          if (!isNaN(ctx.message.text)) {
            order.peopleCount = Number(ctx.message.text);
            order.step++;
            ctx.reply("Скільки годин роботи?");
          } else {
            ctx.reply("Будь ласка, введіть числове значення.");
          }
          break;

        case 3:
          if (!isNaN(ctx.message.text)) {
            order.hours = Number(ctx.message.text);
            order.step++;
            ctx.reply("Вкажіть оплату (від 100 грн/год):");
          } else {
            ctx.reply("Будь ласка, введіть числове значення.");
          }
          break;

        case 4:
          order.payment = Number(ctx.message.text);
          order.step++;
          ctx.reply("Вкажіть місце роботи (локацію):");
          break;

        case 5:
          order.location = ctx.message.text;
          order.step++;
          ctx.reply("Вкажіть ваш номер телефону або нік у Telegram:");
          break;

        case 6:
          order.contact = ctx.message.text;

          ctx.reply(
            `Перевірте деталі вашого замовлення:\n\n` +
              `👤 Шукаю: ${order.role}\n` +
              `👥 Кількість людей: ${order.peopleCount}\n` +
              `⏳ Годин роботи: ${order.hours}\n` +
              `💵 Оплата: ${order.payment} грн/год\n` +
              `📍 Локація: ${order.location}\n` +
              `📞 Контакт: ${order.contact}`,
            Markup.inlineKeyboard([[Markup.button.callback("✅ Оприлюднити", `publish_${userId}`)]])
          );
          break;

        default:
          ctx.reply("Щось пішло не так. Почніть спочатку.");
          delete userOrders[userId];
          break;
      }
    }
  } catch (error) {
    console.error("Помилка створення запиту", error);
  }
};

module.exports = { orderInitHandler, orderCreateHandler };
