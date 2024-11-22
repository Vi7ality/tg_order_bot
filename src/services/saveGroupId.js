// const fs = require("fs");
// const groupFilePath = require("../config/groupStorage");

// const saveGroupId = (groupId) => {
//   const data = JSON.stringify({ groupId });
//   fs.writeFileSync(groupFilePath, data, "utf8");
// };

// Сохранение groupId

const redis = require('../config/redis');
async function saveGroupId(groupId) {
  await redis.set('groupId', groupId);
}



module.exports = saveGroupId;
