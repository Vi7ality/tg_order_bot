const { loadGroupId, deleteGroupId } = require("../services");

const leftChatHandler = async (ctx) => {
  const groupChatId = await loadGroupId();
  const removedGroupId = ctx.chat.id;
  const leftMember = ctx.message.left_chat_member;
  if (groupChatId && groupChatId == removedGroupId) {
    await deleteGroupId();
    console.log(`Бот видалено з групи: ${removedGroupId}`);
  }

  if (leftMember.id === ctx.botInfo.id && ctx.chat.type === "channel") {
    await deleteGroupId();
    console.log(`Бот покинув канал! ID каналу: ${channelId}`);
  }
};

module.exports = leftChatHandler;
