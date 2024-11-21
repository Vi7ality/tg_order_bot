const { Telegraf } = require("telegraf");

const fs = require("fs");
const {
  startHandler,
  orderInitHandler,
  orderCreateHandler,
  publishOrderHandler,
  editOrder,
  respondOrderHandler,
  confirmOrderHandler,
  rejectOrder,
  newChatHandler,
  leftChatHandler,
} = require("./handlers");

require("dotenv").config();

const { APP_TOKEN } = process.env;
const bot = new Telegraf(APP_TOKEN);

bot.start(startHandler);

bot.hears("📝 Створити замовлення", orderInitHandler);

bot.on("text", orderCreateHandler);

bot.on("new_chat_members", newChatHandler);

bot.on("left_chat_member", leftChatHandler);

bot.action(/^publish_(\d+)$/, publishOrderHandler);

bot.action(/^edit(\d+)$/, editOrder);

bot.action(/^respond_(\d+)$/, respondOrderHandler);

bot.action(/^confirm_(.+)$/, confirmOrderHandler);

bot.action(/^reject_(.+)$/, rejectOrder);

bot
  .launch()
  .then(console.log("Bot is running..."))
  .catch((err) => console.error(`Error with bot launching: ${err}`));
