const fs = require("fs");
const groupFilePath = require("../config/groupStorage");

const saveGroupId = (groupId) => {
  const data = JSON.stringify({ groupId });
  fs.writeFileSync(groupFilePath, data, "utf8");
};

module.exports = saveGroupId;
