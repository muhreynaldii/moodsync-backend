const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");

const get = errorHandler(async (req, res) => {
  const data = await models.Recognition.find().exec();
  if (!data) {
    throw new HttpError(400, "Recognition not found");
  }
  return data;
});

const create = errorHandler(async (req, res) => {
  const data = new models.Recognition({ ...req.body, createdBy: req.userId });
  const savedData = await data.save();
  if (!savedData) {
    throw new HttpError(400, "Data can't be saved!");
  }
  return savedData;
});

const update = errorHandler(async (req, res) => {
  const data = await models.Recognition.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      upsert: true,
      new: true,
    }
  );
  if (!data) {
    throw new HttpError(400, "Recognition not found");
  }
  return data;
});

const remove = errorHandler(async (req, res) => {
  const data = await models.Recognition.findById(req.params.id);
  if (!data) {
    throw new HttpError(400, "Recognition not found");
  }
  return await data.remove();
});

module.exports = {
  get,
  create,
  update,
  remove,
};
