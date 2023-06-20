const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");

const getIds = errorHandler(async (req, res) => {
  const usernames = req.query.usernames;
  const usernamesArray = Array.isArray(usernames) ? usernames : [usernames];
  const users = await models.User.find(
    { username: { $in: usernamesArray } },
    "_id username"
  );
  // console.log("users", users);
  // const userIds = users.map((user) => user._id);
  if (!users.length) {
    throw new HttpError(400, "Users not found");
  }
  return users;
});

const getByUsername = errorHandler(async (req, res) => {
  const userDoc = await models.User.findOne({
    username: req.params.username,
  }).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
});

const me = errorHandler(async (req, res) => {
  const userDoc = await models.User.findById(req.userId).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
});

const test = errorHandler(async (req, res) => {
  const data = new models.User({
    username: req.body.username,
  });
  const savedData = await data.save();
  if (!savedData) {
    throw new HttpError(400, "User can't be saved!");
  }
  return savedData;
});

const testt = errorHandler(async (req, res) => {
  const data = await models.User.find({});
  if (!data) {
    throw new HttpError(400, "User not found");
  }
  return data;
});

module.exports = {
  getIds,
  getByUsername,
  me,
  test,
  testt,
};
