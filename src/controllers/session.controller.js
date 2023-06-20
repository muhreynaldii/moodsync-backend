const { errorHandler } = require("../util");
const { HttpError } = require("../error");
const OpenVidu = require("../util/openVidu");

const create = errorHandler(async (req, res) => {
  const session = await OpenVidu.createSession(req.body);
  if (!session) {
    throw new HttpError(400, "Can't create session");
  }
  return session.sessionId;
});

const createConnection = errorHandler(async (req, res) => {
  const session = OpenVidu.getActiveSession(req.params.sessionId);
  if (!session) {
    throw new HttpError(400, "Session not found");
  }
  const connection = await session.createConnection(req.body);
  return connection.token;
});

module.exports = {
  create,
  createConnection,
};
