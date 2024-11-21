const redis = require("../config/redis");
const { Markup } = require("telegraf");
const fs = require("fs");

const groupFilePath = "./src/groupId.json";

const loadGroupId = () => {
  try {
    const data = fs.readFileSync(groupFilePath, "utf8");
    const { groupId } = JSON.parse(data);
    return groupId;
  } catch (err) {
    console.log(err);
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
  console.log("userId", userId);

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
        // await redis.del(`order:${userId}`); // Видалити замовлення після публікації
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
  const workerId = ctx.update.callback_query.from.id;
  const messageId = ctx.callbackQuery.message.message_id;

  if (workerUsername) {
    try {
      await redis.hset(`order:${customerId}`, "messageId", messageId);

      await ctx.telegram.sendMessage(
        customerId,
        `На ваше замовлення відгукнувся користувач @${workerUsername}. Ви можете підтвердити або відхилити відгук.`,
        Markup.inlineKeyboard([
          Markup.button.callback("Підтвердити", `confirm_${customerId}_${workerUsername}`),
          Markup.button.callback("Відхилити", `reject_${customerId}_${workerUsername}`),
        ])
      );
      await ctx.telegram.sendMessage(workerId, "Ваш відгук відправлено замовнику.");
    } catch (error) {
      console.error("Помилка відправки повідомлення замовнику:", error);
      await ctx.telegram.sendMessage(customerId, "Сталася помилка при відправці відгуку.");
    }
  }
};

const confirmOrder = async (ctx) => {
  const [customerId, workerUsername] = ctx.match.slice(1); // Отримуємо customerId і workerUsername

  try {
    // Отримуємо message_id та groupChatId
    console.log("ctx", ctx);
    console.log("customerId", customerId);
    const orderDetails = await redis.hgetall(`order:${customerId}`);
    const messageId = orderDetails.messageId;
    console.log("orderDetails", orderDetails);

    if (!messageId || !groupChatId) {
      throw new Error("Дані про замовлення або групу відсутні.");
    }

    // Формуємо текст замовлення
    const updatedOrderText =
      `Нове замовлення:\n\n` +
      `${orderDetails.role ? `👤 Шукаю: ${orderDetails.role}\n` : ""}` +
      `${orderDetails.peopleCount ? `👥 Кількість людей: ${orderDetails.peopleCount}\n` : ""}` +
      `${orderDetails.hours ? `⏳ Годин роботи: ${orderDetails.hours}\n` : ""}` +
      `${orderDetails.payment ? `💵 Оплата: ${orderDetails.payment} грн/год\n` : ""}` +
      `${orderDetails.location ? `📍 Локація: ${orderDetails.location}\n` : ""}` +
      `${orderDetails.contact ? `📞 Контакт: ${orderDetails.contact}\n` : ""}\n` +
      `Замовлення закрито.`;

    // Редагуємо повідомлення в групі
    await ctx.telegram.editMessageText(groupChatId, messageId, null, updatedOrderText);

    // Підтверджуємо відгук у приватному чаті
    await ctx.editMessageText(
      `Відгук користувача @${workerUsername} підтверджено. Замовлення закрито.`
    );
  } catch (error) {
    console.error("Помилка підтвердження відгуку:", error);
    await ctx.reply("Сталася помилка при підтвердженні замовлення.");
  }
};

const rejectOrder = async (ctx) => {
  const [customerId, workerUsername] = ctx.match.slice(1); // Отримуємо customerId і workerUsername
  try {
    ctx.editMessageText(`Відгук користувача @${workerUsername} відхилено.`);
  } catch (error) {
    console.error("Помилка відхилення відгуку:", error);
    ctx.reply("Сталася помилка при відхиленні замовлення.");
  }
};

module.exports = {
  orderInitHandler,
  publishOrder,
  editOrder,
  respondOrder,
  confirmOrder,
  rejectOrder,
};
