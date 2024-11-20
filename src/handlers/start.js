const { Markup } = require("telegraf");

const startScript = async (ctx) => {
  try {
    await ctx.reply(
      "Привіт, я Connect Worker Bot! Я допоможу тобі створити замовлення. Вибери одну з опцій:",
      Markup.keyboard(["📝 Створити замовлення"]).oneTime().resize()
    );
  } catch (err) {
    console.error("Помилка обробки команди /start", err);
  }
};
module.exports = startScript;
