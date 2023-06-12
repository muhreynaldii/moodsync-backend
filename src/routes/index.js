const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const usersRouter = require("./users");
const meetingRouter = require("./meeting");
const recognitionRouter = require("./recognition");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/meeting", meetingRouter);
router.use("/recognition", recognitionRouter);

module.exports = router;
