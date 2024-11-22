const rejectOrderHandler = async (ctx) => {
  const [data] = ctx.match.slice(1);
  const [userId, workerUsername] = data.split("_");
  try {
    ctx.editMessageText(`❌Відгук користувача @${workerUsername} відхилено.`);
  } catch (error) {
    console.error("Помилка відхилення відгуку:", error);
    ctx.reply("Сталася помилка при відхиленні замовлення.");
  }
};

module.exports = rejectOrderHandler;
