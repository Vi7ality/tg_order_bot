const redis = require("../config/redis");
const { Markup } = require("telegraf");
const fs = require("fs");

const groupFilePath = "../groupId.json";

const loadGroupId = () => {
  try {
    const data = fs.readFileSync(groupFilePath, "utf8");
    return JSON.parse(data).groupId;
  } catch (err) {
    return null;
  }
};

let groupChatId = loadGroupId();

const orderInitHandler = async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    await redis.hset(`order:${userId}`, "step", 1);
    ctx.reply("Вкажіть, кого ви шукаєте?");
  } catch (error) {
    console.error("Помилка створення запиту:", error);
  }
};

const publishOrder = async (ctx) => {
  const userId = ctx.match[1];

  try {
    const order = await redis.hgetall(`order:${userId}`);

    if (order && order.step === "6") {
      const { role, peopleCount, hours, payment, location, contact } = order;
      console.log("order", order);
      console.log("groupID", groupChatId);

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
        await redis.del(`order:${userId}`); // Видалити замовлення після публікації
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

const editOrder = async (ctx) => {
  console.log("order edit");
  try {
    const field = ctx.match[1];
    const userId = ctx.match[2];

    const order = await redis.hgetall(`order:${userId}`);

    if (order) {
      order.editingField = field;
      const fieldNameMap = {
        role: "Кого шукаєте",
        peopleCount: "Кількість людей",
        hours: "Годин роботи",
        payment: "Оплата",
        location: "Локація",
        contact: "Контакт",
      };

      ctx.reply(`Вкажіть нове значення для поля: ${fieldNameMap[field] || field}`);
    } else {
      ctx.reply("Замовлення не знайдено.");
    }
  } catch (error) {
    console.error("Помилка редагування поля:", error);
    ctx.reply("Сталася помилка при редагуванні замовлення.");
  }
};

const respondOrder = async (ctx) => {
  const customerId = ctx.match[1];
  const workerUsername = ctx.from.username;

  if (workerUsername) {
    try {
      await ctx.telegram.sendMessage(
        customerId,
        `<На ваше замовлення відгукнувся користувач @${workerUsername}. Ви можете підтвердити або відхилити відгук>.`,
        Markup.inlineKeyboard([
          Markup.button.callback("Підтвердити", `confirm_${workerUsername}`),
          Markup.button.callback("Відхилити", `reject_${workerUsername}`),
        ])
      );
      ctx.reply("Ваш відгук відправлено замовнику.");
    } catch (error) {
      console.error("Помилка відправки повідомлення замовнику:", error);
      ctx.reply("Сталася помилка при відправці відгуку.");
    }
  } else {
    ctx.reply("Ви повинні мати імʼя користувача у Telegram, щоб відгукнутись.");
  }
};

const confirmOrder = async (ctx) => {
  const workerUsername = ctx.match[1];
  ctx.editMessageText(`Відгук користувача @${workerUsername} підтверджено. Замовлення закрито.`);
};

const rejectOrder = async (ctx) => {
  const workerUsername = ctx.match[1];
  ctx.editMessageText(`Відгук користувача @${workerUsername} відхилено.`);
};

module.exports = {
  orderInitHandler,
  publishOrder,
  editOrder,
  respondOrder,
  confirmOrder,
  rejectOrder,
};
