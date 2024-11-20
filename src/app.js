const { Telegraf } = require("telegraf");
const path = require("path");
const {
  startHandler,
  orderInitHandler,
  orderCreateHandler,
  publishOrder,
  editOrder,
  respondOrder,
  confirmOrder,
  rejectOrder,
} = require("./handlers");

require("dotenv").config();

const { APP_TOKEN, ADMIN_ID } = process.env;
const bot = new Telegraf(APP_TOKEN);

const userOrders = {};

bot.start(startHandler);

bot.hears("📝 Створити замовлення", orderInitHandler);

bot.on("text", orderCreateHandler);

const groupFilePath = path.join(__dirname, "groupId.json");

const saveGroupId = (groupId) => {
  const data = JSON.stringify({ groupId });
  fs.writeFileSync(groupFilePath, data, "utf8");
};

bot.on("new_chat_members", (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  const botAdded = newMembers.some((member) => member.id === ctx.botInfo.id);

  if (botAdded && (ctx.chat.type === "supergroup" || ctx.chat.type === "group")) {
    const groupChatId = ctx.chat.id;
    saveGroupId(groupChatId);
    console.log(`Bot додано в групу! ID групи: ${groupChatId}`);
  }
});

const loadGroupId = () => {
  try {
    const data = fs.readFileSync(groupFilePath, "utf8");
    return JSON.parse(data).groupId;
  } catch (err) {
    return null;
  }
};

let groupChatId = loadGroupId();

bot.action(/^publish_(\d+)$/, publishOrder);

bot.action(/^edit(\d+)$/, editOrder);

bot.action(/^respond_(\d+)$/, respondOrder);

bot.action(/^confirm_(.+)$/, confirmOrder);

bot.action(/^reject_(.+)$/, rejectOrder);

bot
  .launch()
  .then(console.log("Bot is running..."))
  .catch((err) => console.error(`Error with bot launching: ${err}`));
