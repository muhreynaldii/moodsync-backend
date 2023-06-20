const OpenVidu = require("openvidu-node-client").OpenVidu;

const OPENVIDU_URL = process.env.OPENVIDU_URL || "http://localhost:4443";
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || "MY_SECRET";

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

const activeSessions = [];

const createSession = async (options) => {
  try {
    const session = await openvidu.createSession(options);
    activeSessions.push(session);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating session");
  }
};

const getActiveSession = (sessionId) => {
  return activeSessions.find((s) => s.sessionId === sessionId);
};

module.exports = {
  createSession,
  getActiveSession,
};
