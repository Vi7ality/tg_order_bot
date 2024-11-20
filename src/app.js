const { Telegraf } = require("telegraf");
const path = require("path");
require("dotenv").config();

const { APP_TOKEN, ADMIN_ID } = process.env;
const bot = new Telegraf(APP_TOKEN);
