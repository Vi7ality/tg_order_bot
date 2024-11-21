const { loadGroupId, saveGroupId } = require("../services");

const leftChatHandler = (ctx) => {
  const groupChatId = loadGroupId();
  const removedGroupId = ctx.chat.id;
  if (groupChatId && groupChatId === removedGroupId) {
    saveGroupId({});
    console.log(`Бот видалено з групи: ${removedGroupId}`);
  }
};

module.exports = leftChatHandler;
