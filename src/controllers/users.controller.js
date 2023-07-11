const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");
const mongoose = require("mongoose");

const getIds = errorHandler(async (req, res) => {
  const usernames = req.query.usernames;
  const usernamesArray = Array.isArray(usernames) ? usernames : [usernames];
  const users = await models.User.find({ username: { $in: usernamesArray } }, "_id username");
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

const getById = errorHandler(async (req, res) => {
  const userDoc = await models.User.findById(req.params.id).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
});

const getOverview = errorHandler(async (req, res) => {
  const data = await models.Recognition.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(req.params.id),
        meetingId: {
          $in: await models.Meeting.find({}).distinct("_id"),
        },
      },
    },
    {
      $group: {
        _id: null,
        neutral: { $avg: "$neutral" },
        happy: { $avg: "$happy" },
        sad: { $avg: "$sad" },
        angry: { $avg: "$angry" },
        fearful: { $avg: "$fearful" },
        disgusted: { $avg: "$disgusted" },
        surprised: { $avg: "$surprised" },
      },
    },
    {
      $project: {
        neutral: { $round: { $multiply: ["$neutral", 100] } },
        happy: { $round: { $multiply: ["$happy", 100] } },
        sad: { $round: { $multiply: ["$sad", 100] } },
        angry: { $round: { $multiply: ["$angry", 100] } },
        fearful: { $round: { $multiply: ["$fearful", 100] } },
        disgusted: { $round: { $multiply: ["$disgusted", 100] } },
        surprised: { $round: { $multiply: ["$surprised", 100] } },
      },
    },
    { $unset: ["_id"] },
  ]);
  const labels = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgusted", "Surprised"];
  if (!data.length) {
    throw new HttpError(400, "User not found");
  }
  return { labels, datas: Object.values(data[0]) };
});

const getSummary = errorHandler(async (req, res) => {
  const data = await models.Recognition.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(req.params.id),
        meetingId: {
          $in: await models.Meeting.find({}).distinct("_id"),
        },
      },
    },
    {
      $group: {
        _id: null,
        positive: { $sum: { $add: ["$happy", "$surprised"] } },
        negative: {
          $sum: { $add: ["$sad", "$angry", "$fearful", "$disgusted"] },
        },
        count: {
          $sum: {
            $add: ["$happy", "$sad", "$angry", "$fearful", "$disgusted", "$surprised"],
          },
        },
      },
    },
    {
      $project: {
        positive: {
          $cond: [
            { $eq: ["$count", 0] },
            0,
            {
              $round: {
                $multiply: [{ $divide: ["$positive", "$count"] }, 100],
              },
            },
          ],
        },
        negative: {
          $cond: [
            { $eq: ["$count", 0] },
            0,
            {
              $round: {
                $multiply: [{ $divide: ["$negative", "$count"] }, 100],
              },
            },
          ],
        },
      },
    },
    { $unset: ["_id", "count"] },
  ]);
  const labels = ["Positive", "Negative"];
  if (!data.length) {
    throw new HttpError(400, "User not found");
  }
  return { labels, datas: Object.values(data[0]) };
});

const me = errorHandler(async (req, res) => {
  const userDoc = await models.User.findById(req.userId).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
});

const postNewUsers = errorHandler(async (req, res) => {
  const data = new models.User({
    username: req.body.username,
  });
  const savedData = await data.save();
  if (!savedData) {
    throw new HttpError(400, "User can't be saved!");
  }
  return savedData;
});

const getAllUsers = errorHandler(async (req, res) => {
  const { meetingId } = req.query;
  const data = await models.User.find({
    ...(meetingId && {
      _id: {
        $in: await models.Recognition.find({ meetingId }).distinct("userId"),
      },
    }),
  }).sort({ createdAt: "desc" });
  if (!data) {
    throw new HttpError(400, "User not found");
  }
  return data;
});

const getCount = errorHandler(async (req, res) => {
  const data = await models.User.count();
  if (!data) {
    throw new HttpError(400, "User not found");
  }
  return data;
});

const update = errorHandler(async (req, res) => {
  const data = await models.User.findByIdAndUpdate(req.params.id, req.body, {
    upsert: true,
    new: true,
  });
  if (!data) {
    throw new HttpError(400, "User not found");
  }
  return data;
});

const remove = errorHandler(async (req, res) => {
  const data = await models.User.findById(req.params.id);
  if (!data) {
    throw new HttpError(400, "User not found");
  }
  return await data.remove();
});

module.exports = {
  getIds,
  getByUsername,
  me,
  postNewUsers,
  getAllUsers,
  getById,
  getOverview,
  getSummary,
  getCount,
  update,
  remove,
};
