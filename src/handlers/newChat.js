const { saveGroupId } = require("../services");
const newChatHandler = (ctx) => {
  console.log("added");
  const newMembers = ctx.message.new_chat_members;
  const botAdded = newMembers.some((member) => member.id === ctx.botInfo.id);

  if (botAdded && (ctx.chat.type === "supergroup" || ctx.chat.type === "group")) {
    const groupChatId = ctx.chat.id;
    saveGroupId(groupChatId);
    console.log(`Bot додано в групу! ID групи: ${groupChatId}`);
  }
};

module.exports = newChatHandler;
