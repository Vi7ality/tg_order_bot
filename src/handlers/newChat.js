const { saveGroupId, loadGroupId, deleteGroupId } = require("../services");

const newChatHandler = async (ctx) => {
  const savedGroupId = await loadGroupId();
  const newMembers = ctx.message?.new_chat_members;
  const groupChatId = ctx.chat.id;

  if (newMembers && !savedGroupId) {
    const botAdded = newMembers.some((member) => member.id === ctx.botInfo.id);

    if (botAdded && (ctx.chat.type === "supergroup" || ctx.chat.type === "group")) {
      await saveGroupId(groupChatId);
      console.log(`Bot додано в групу! ID групи: ${groupChatId}`);
    }
  }

  if (ctx.chat.type === "channel") {
    const status = ctx.myChatMember.new_chat_member.status;
    if (status === "administrator" && !savedGroupId) {
      await saveGroupId(groupChatId);
      console.log(`Bot added to channel! Channel ID: ${groupChatId}`);
    }
    if (status === "kicked" && savedGroupId == groupChatId) {
      await deleteGroupId();
      console.log(`Бот покинув канал! ID каналу: ${groupChatId}`);
    }
  }
};

module.exports = newChatHandler;
