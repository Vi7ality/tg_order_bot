const { Telegraf, Markup } = require("telegraf");
const path = require("path");
const startScript = require("./handlers");
require("dotenv").config();

const { APP_TOKEN, ADMIN_ID } = process.env;
const bot = new Telegraf(APP_TOKEN);

const userOrders = {};

bot.start((ctx) => {
  ctx.reply(
    `Привіт, мене звати Connect Worker Bot. Я допоможу зробити тобі замовлення.`,
    Markup.keyboard([["📝 Створити замовлення"]])
      .resize()
      .oneTime()
  );
});

bot.hears("📝 Створити замовлення", (ctx) => {
  const userId = ctx.from.id;
  userOrders[userId] = { step: 1 };
  ctx.reply("Вкажіть, кого ви шукаєте?");
});

bot.on("text", (ctx) => {
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
            `👤 Кого шукаєте: ${order.role}\n` +
            `👥 Кількість людей: ${order.peopleCount}\n` +
            `⏳ Годин роботи: ${order.hours}\n` +
            `💵 Оплата: ${order.payment} грн/год\n` +
            `📍 Локація: ${order.location}\n` +
            `📞 Контакт: ${order.contact}`,
          Markup.inlineKeyboard([
            Markup.button.callback("✅ Оприлюднити", `publish_${userId}`),
            Markup.button.callback("✏️ Редагувати", `edit_${userId}`),
            Markup.button.callback("❌ Видалити", `delete_${userId}`),
          ])
        );
        break;

      default:
        ctx.reply("Щось пішло не так. Почніть спочатку.");
        delete userOrders[userId];
        break;
    }
  }
});

bot.action(/^publish_(\d+)$/, (ctx) => {
  const userId = ctx.match[1];
  const order = userOrders[userId];

  if (order) {
    ctx.telegram.sendMessage(
      "@your_group_chat", //  username групи
      `Нове замовлення:\n\n` +
        `👤 Кого шукаєте: ${order.role}\n` +
        `👥 Кількість людей: ${order.peopleCount}\n` +
        `⏳ Годин роботи: ${order.hours}\n` +
        `💵 Оплата: ${order.payment} грн/год\n` +
        `📍 Локація: ${order.location}\n` +
        `📞 Контакт: ${order.contact}\n\n` +
        `Натисніть кнопку, щоб відгукнутись:`,
      Markup.inlineKeyboard([Markup.button.callback("Відгукнутись", `respond_${userId}`)])
    );

    ctx.editMessageText("Ваше замовлення опубліковано.");
    delete userOrders[userId];
  } else {
    ctx.reply("Замовлення не знайдено.");
  }
});

// Обробка відгуку
bot.action(/^respond_(\d+)$/, (ctx) => {
  const customerId = ctx.match[1];
  const workerUsername = ctx.from.username;

  if (workerUsername) {
    ctx.telegram.sendMessage(
      customerId,
      `На ваше замовлення відгукнувся користувач @${workerUsername}. Ви можете підтвердити або відхилити відгук.`,
      Markup.inlineKeyboard([
        Markup.button.callback("Підтвердити", `confirm_${workerUsername}`),
        Markup.button.callback("Відхилити", `reject_${workerUsername}`),
      ])
    );
    ctx.reply("Ваш відгук відправлено замовнику.");
  } else {
    ctx.reply("Ви повинні мати імʼя користувача у Telegram, щоб відгукнутись.");
  }
});

// Підтвердження відгуку
bot.action(/^confirm_(.+)$/, (ctx) => {
  const workerUsername = ctx.match[1];
  ctx.editMessageText(`Відгук користувача @${workerUsername} підтверджено. Замовлення закрито.`);
});

// Відхилення
bot.action(/^reject_(.+)$/, (ctx) => {
  const workerUsername = ctx.match[1];
  ctx.editMessageText(`Відгук користувача @${workerUsername} відхилено.`);
});

bot.launch();
console.log("Bot is running...");
