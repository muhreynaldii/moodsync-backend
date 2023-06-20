const auth = require("./auth.controller");
const users = require("./users.controller");
const meeting = require("./meeting.controller");
const recognition = require("./recognition.controller");
const session = require("./session.controller");

module.exports = {
  auth,
  users,
  meeting,
  recognition,
  session,
};
