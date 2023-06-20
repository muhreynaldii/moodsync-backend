const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");
const io = require("../util/socketio");

const get = errorHandler(async (req, res) => {
  const data = await models.Meeting.find().sort({ createdAt: "desc" });
  if (!data) {
    throw new HttpError(400, "Meeting not found");
  }
  // TO BE DELETED (DEBUG WS)
  // const socket = io();
  // setInterval(() => {
  //   socket
  //     .to(`SessionA`)
  //     .emit("RECOGNITION_DATA_ADDED", { datetime: new Date() });
  // }, 2000);
  return data;
});

const getById = errorHandler(async (req, res) => {
  const data = await models.Meeting.findById(req.params.id);
  if (!data) {
    throw new HttpError(400, "Meeting not found");
  }
  return data;
});

const getByCode = errorHandler(async (req, res) => {
  const data = await models.Meeting.findOne({ code: req.params.code });
  if (!data) {
    throw new HttpError(400, "Meeting not found");
  }
  return data;
});

const getCount = errorHandler(async (req, res) => {
  const data = await models.Meeting.count();
  if (!data) {
    throw new HttpError(400, "Meeting not found");
  }
  return data;
});

const create = errorHandler(async (req, res) => {
  const data = new models.Meeting({ ...req.body, createdBy: req.userId });
  const savedData = await data.save();
  if (!savedData) {
    throw new HttpError(400, "Data can't be saved!");
  }
  return savedData;
});

const update = errorHandler(async (req, res) => {
  const data = await models.Meeting.findByIdAndUpdate(req.params.id, req.body, {
    upsert: true,
    new: true,
  });
  if (!data) {
    throw new HttpError(400, "Meeting not found");
  }
  return data;
});

const remove = errorHandler(async (req, res) => {
  const data = await models.Meeting.findById(req.params.id);
  if (!data) {
    throw new HttpError(400, "Meeting not found");
  }
  return await data.remove();
});

module.exports = {
  get,
  getById,
  getByCode,
  getCount,
  create,
  update,
  remove,
};
