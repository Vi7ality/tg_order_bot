const { Telegraf } = require("telegraf");
const path = require("path");
require("dotenv").config();

const { APP_TOKEN, ADMIN_ID } = process.env;
const bot = new Telegraf(APP_TOKEN);

const orders = {};

bot.start((ctx) => {
  ctx.reply(
    `Привіт, мене звати Connect Worker Bot. Я допоможу зробити тобі замовлення.\n\nЗаповни таблицю:`
  );
  ctx.reply(
    `1. Кого шукаєш?\n2. Кількість людей?\n3. Скільки годин робота?\n4. Оплата (від 100грн/год)?\n5. Локація (місце роботи)?\n6. Ваш номер або нік Телеграм.`
  );
});

bot.launch();
console.log("Bot is running...");
