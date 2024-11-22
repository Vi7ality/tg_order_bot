const redis = require("../config/redis");
async function deleteGroupId(groupId) {
  await redis.del("groupId", groupId);
}

module.exports = deleteGroupId;
