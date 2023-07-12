const axios = require("axios");
const { errorHandler } = require("../util");
const { HttpError } = require("../error");

const OPENVIDU_URL = process.env.OPENVIDU_URL || "http://localhost:4443";
const OPENVIDU_USERNAME = "OPENVIDUAPP";
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || "MY_SECRET";

const create = errorHandler(async (req, res) => {
  const customSessionId = req.body.customSessionId;

  try {
    // Check if the session already exists
    const response = await axios.get(`${OPENVIDU_URL}/api/sessions/${customSessionId}`, {
      auth: {
        username: OPENVIDU_USERNAME,
        password: OPENVIDU_SECRET,
      },
    });

    if (response.status === 200) {
      // Session already exists, return the session ID
      return customSessionId;
    }
  } catch (error) {
    // Session does not exist, proceed to create a new session
  }

  try {
    // Create a new session
    const response = await axios.post(
      `${OPENVIDU_URL}/api/sessions`,
      { customSessionId },
      {
        auth: {
          username: OPENVIDU_USERNAME,
          password: OPENVIDU_SECRET,
        },
      }
    );

    if (response.status !== 200) {
      throw new HttpError(response.status, "Can't create session");
    }

    return response.data.id;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating session");
  }
});

const createConnection = errorHandler(async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const response = await axios.post(
      `${OPENVIDU_URL}/api/sessions/${sessionId}/connection`,
      {},
      {
        auth: {
          username: OPENVIDU_USERNAME,
          password: OPENVIDU_SECRET,
        },
      }
    );
    if (response.status !== 200) {
      throw new HttpError(response.status, "Session not found");
    }
    return response.data.token;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating connection");
  }
});

const removeSession = errorHandler(async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    const response = await axios.delete(`${OPENVIDU_URL}/api/sessions/${sessionId}`, {
      auth: {
        username: OPENVIDU_USERNAME,
        password: OPENVIDU_SECRET,
      },
    });
    if (response.status !== 204) {
      throw new HttpError(response.status, "Can't delete session");
    }
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting session");
  }
});

const removeConnection = errorHandler(async (req, res) => {
  const sessionId = req.params.sessionId;
  const connectionId = req.params.connectionId;

  try {
    const response = await axios.delete(`${OPENVIDU_URL}/api/sessions/${sessionId}/connection/${connectionId}`, {
      auth: {
        username: OPENVIDU_USERNAME,
        password: OPENVIDU_SECRET,
      },
    });

    if (response.status !== 204) {
      throw new HttpError(response.status, "Can't delete connection");
    }

    res.json({ message: "Connection deleted successfully" });
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting connection");
  }
});

module.exports = {
  create,
  createConnection,
  removeSession,
  removeConnection,
};
