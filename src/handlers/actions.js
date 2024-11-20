const loadGroupId = () => {
  try {
    const data = fs.readFileSync(groupFilePath, "utf8");
    return JSON.parse(data).groupId;
  } catch (err) {
    return null;
  }
};

let groupChatId = loadGroupId();

const publishOrder = async (ctx) => {
  const userId = ctx.match[1];
  const order = userOrders[userId];

  if (order && groupChatId) {
    ctx.telegram.sendMessage(
      groupChatId,
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
    ctx.reply("Група, в яку додано бота, не знайдена або замовлення не знайдено.");
  }
};

const respondOrder = async (ctx) => {
  const customerId = ctx.match[1];
  const workerUsername = ctx.from.username;

  if (workerUsername) {
    ctx.telegram.sendMessage(
      customerId,
      `<На ваше замовлення відгукнувся користувач @${workerUsername}. Ви можете підтвердити або відхилити відгук>.`,
      Markup.inlineKeyboard([
        Markup.button.callback("Підтвердити", `confirm_${workerUsername}`),
        Markup.button.callback("Відхилити", `reject_${workerUsername}`),
      ])
    );
    ctx.reply("Ваш відгук відправлено замовнику.");
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

module.exports = { publishOrder, respondOrder, confirmOrder, rejectOrder };
