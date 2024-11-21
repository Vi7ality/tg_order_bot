const { saveGroupId } = require("../services");

const newChatHandler = (ctx) => {
  console.log("Checking new chat members or added bot...");

  const newMembers = ctx.message?.new_chat_members;

  // Check if bot is added via new chat members (groups/supergroups)
  if (newMembers) {
    const botAdded = newMembers.some((member) => member.id === ctx.botInfo.id);

    if (botAdded && (ctx.chat.type === "supergroup" || ctx.chat.type === "group")) {
      const groupChatId = ctx.chat.id;
      saveGroupId(groupChatId);
      console.log(`Bot додано в групу! ID групи: ${groupChatId}`);
    }
  }

  // Handle channels
  if (ctx.chat.type === "channel") {
    console.log(`Bot added to a channel! ID каналу: ${ctx.chat.id}`);
    const channelId = ctx.chat.id;
    saveGroupId(channelId);
  }
};

module.exports = newChatHandler;

module.exports = newChatHandler;
