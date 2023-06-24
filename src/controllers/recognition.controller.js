const mongoose = require("mongoose");
const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");
const io = require("../util/socketio");

let recognitionInterval = {};

const get = errorHandler(async (req, res) => {
  const [
    meeting,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
  ] = await Promise.all([
    models.Meeting.findById(req.params.id).lean(),
    models.Recognition.aggregate([
      { $match: { meetingId: mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: { $toString: "$createdAt" },
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
          neutral: { $round: ["$neutral", 2] },
          happy: { $round: ["$happy", 2] },
          sad: { $round: ["$sad", 2] },
          angry: { $round: ["$angry", 2] },
          fearful: { $round: ["$fearful", 2] },
          disgusted: { $round: ["$disgusted", 2] },
          surprised: { $round: ["$surprised", 2] },
        },
      },
      { $sort: { _id: -1 } },
      ...(req.query.limit ? [{ $limit: parseInt(req.query.limit, 10) }] : []),
      { $sort: { _id: 1 } },
    ]),
    models.Recognition.aggregate([
      {
        $match: { meetingId: mongoose.Types.ObjectId(req.params.id) },
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
    ]),
    models.Recognition.aggregate([
      {
        $match: { meetingId: mongoose.Types.ObjectId(req.params.id) },
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
              $add: [
                "$happy",
                "$sad",
                "$angry",
                "$fearful",
                "$disgusted",
                "$surprised",
              ],
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
    ]),
  ]);
  const labelsOverview = [
    "Neutral",
    "Happy",
    "Sad",
    "Angry",
    "Fearful",
    "Disgusted",
    "Surprised",
  ];
  const labelsSummary = ["Positive", "Negative"];
  if (!meeting) {
    throw new HttpError(400, "Recognition not found");
  }
  return {
    meeting: {
      ...meeting,
      recognitionsOverview: {
        labels: labelsOverview,
        datas: Object.values(recognitionsOverview[0]),
      },
      recognitionsSummary: {
        labels: labelsSummary,
        datas: Object.values(recognitionsSummary[0]),
      },
      recognitionsDetail: {
        labels: recognitionDetail.map(({ _id }) => _id),
        neutral: recognitionDetail.map(({ neutral }) => neutral),
        happy: recognitionDetail.map(({ happy }) => happy),
        sad: recognitionDetail.map(({ sad }) => sad),
        angry: recognitionDetail.map(({ angry }) => angry),
        fearful: recognitionDetail.map(({ fearful }) => fearful),
        disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
        surprised: recognitionDetail.map(({ surprised }) => surprised),
      },
    },
  };
});

const getById = errorHandler(async (req, res) => {
  const [
    meeting,
    user,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
  ] = await Promise.all([
    models.Meeting.findById(req.params.id).lean(),
    models.User.findById(req.params.userId).lean(),
    req.query.limit
      ? models.Recognition.aggregate([
          {
            $match: {
              meetingId: mongoose.Types.ObjectId(req.params.id),
              userId: mongoose.Types.ObjectId(req.params.userId),
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: parseInt(req.query.limit, 10) },
          { $sort: { createdAt: 1 } },
        ])
      : models.Recognition.find({
          meetingId: req.params.id,
          userId: req.params.userId,
        }).select("-meeting -user"),
    models.Recognition.aggregate([
      {
        $match: {
          meetingId: mongoose.Types.ObjectId(req.params.id),
          userId: mongoose.Types.ObjectId(req.params.userId),
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
    ]),
    models.Recognition.aggregate([
      {
        $match: {
          meetingId: mongoose.Types.ObjectId(req.params.id),
          userId: mongoose.Types.ObjectId(req.params.userId),
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
              $add: [
                "$happy",
                "$sad",
                "$angry",
                "$fearful",
                "$disgusted",
                "$surprised",
              ],
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
    ]),
  ]);
  const labelsOverview = [
    "Neutral",
    "Happy",
    "Sad",
    "Angry",
    "Fearful",
    "Disgusted",
    "Surprised",
  ];
  const labelsSummary = ["Positive", "Negative"];
  if (!meeting || !user) {
    throw new HttpError(400, "Recognition not found");
  }
  return {
    user,
    meeting: {
      ...meeting,
      recognitionsOverview: {
        labels: labelsOverview,
        datas: Object.values(recognitionsOverview[0]),
      },
      recognitionsSummary: {
        labels: labelsSummary,
        datas: Object.values(recognitionsSummary[0]),
      },
      recognitionsDetail: {
        labels: recognitionDetail.map(({ createdAt }) => createdAt),
        neutral: recognitionDetail.map(({ neutral }) => neutral),
        happy: recognitionDetail.map(({ happy }) => happy),
        sad: recognitionDetail.map(({ sad }) => sad),
        angry: recognitionDetail.map(({ angry }) => angry),
        fearful: recognitionDetail.map(({ fearful }) => fearful),
        disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
        surprised: recognitionDetail.map(({ surprised }) => surprised),
      },
    },
  };
});

const getOverview = errorHandler(async (req, res) => {
  const data = await models.Recognition.aggregate([
    {
      $match: {
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
  const labels = [
    "Neutral",
    "Happy",
    "Sad",
    "Angry",
    "Fearful",
    "Disgusted",
    "Surprised",
  ];
  return data[0] ? { labels, datas: Object.values(data[0]) } : {};
});

const getSummary = errorHandler(async (req, res) => {
  const data = await models.Recognition.aggregate([
    {
      $match: {
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
            $add: [
              "$happy",
              "$sad",
              "$angry",
              "$fearful",
              "$disgusted",
              "$surprised",
            ],
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
  return data[0] ? { labels, datas: Object.values(data[0]) } : {};
});

const getCurrent = errorHandler(async (req, res) => {
  const { userId, meetingId, createdAt } = req.query;
  const userIdArray = Array.isArray(userId) ? userId : [userId];
  const recognition = await models.Recognition.find({
    // userId: { $in: userIdArray },
    meetingId: mongoose.Types.ObjectId(meetingId),
    createdAt,
  }).populate("userId", "username");
  if (!recognition.length) {
    throw new HttpError(400, "Recognition not found");
  }
  const response = recognition.map((recognitionItem) => {
    return {
      ...recognitionItem._doc,
      username: recognitionItem.userId.username,
    };
  });

  return response;
});

const create = errorHandler(async (req, res) => {
  const recognition = new models.Recognition(
    req.body
    // userId: req.userId,
  );
  const savedData = await recognition.save();
  if (!savedData) {
    throw new HttpError(400, "Data can't be saved!");
  }
  const socket = io();
  socket
    .to([req.body.meetingId, `${req.body.meetingId}-${req.body.userId}`])
    .emit("RECOGNITION_DATA_ADDED");
  return savedData;
});

const update = errorHandler(async (req, res) => {
  const data = await models.Meeting.findByIdAndUpdate(
    req.params.id,
    {
      isStart: req.body.isStart,
      ...(req.body.isStart && { startedAt: new Date() }),
    },
    { new: true }
  );
  if (req.body.isStart) {
    recognitionInterval[req.body.code] = setInterval(() => {
      const socket = io();
      socket.to(`student-${req.body.code}`).emit("SEND_RECOGNITION_DATA", {
        meetingId: req.params.id,
        datetime: new Date(),
      });
    }, 5000);
  } else {
    clearInterval(recognitionInterval[req.body.code]);
    delete recognitionInterval[req.body.code];
  }
  if (!data) {
    throw new HttpError(400, "Data can't be saved!");
  }
  return data;
});

const remove = errorHandler(async (req, res) => {
  const data = await models.Recognition.findById(req.params.id);
  if (!data) {
    throw new HttpError(400, "Recognition not found");
  }
  await data.remove();
  return data;
});

module.exports = {
  get,
  getById,
  getOverview,
  getSummary,
  getCurrent,
  create,
  update,
  remove,
};
