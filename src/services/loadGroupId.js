const fs = require("fs");
const groupFilePath = require("../config/groupStorage");

const loadGroupId = () => {
  try {
    const data = fs.readFileSync(groupFilePath, "utf8");
    return JSON.parse(data).groupId;
  } catch (err) {
    return null;
  }
};

module.exports = loadGroupId;
