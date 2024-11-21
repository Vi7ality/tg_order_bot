const { loadGroupId, saveGroupId } = require("../services");

const leftChatHandler = (ctx) => {
  console.log("removing from chat...");
  const groupChatId = loadGroupId();
  const removedGroupId = ctx.chat.id;
  const leftMember = ctx.message.left_chat_member;
  if (groupChatId && groupChatId === removedGroupId) {
    saveGroupId(null);
    console.log(`Бот видалено з групи: ${removedGroupId}`);
  }

  if (leftMember.id === ctx.botInfo.id && ctx.chat.type === "channel") {
    const channelId = ctx.chat.id;

    saveGroupId(null);
    console.log(`Бот покинув канал! ID каналу: ${channelId}`);
  }
};

module.exports = leftChatHandler;
