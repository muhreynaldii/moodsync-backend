const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const usersRouter = require("./users");
const meetingRouter = require("./meeting");
const recognitionRouter = require("./recognition");
const sessionRouter = require("./session");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/meeting", meetingRouter);
router.use("/recognition", recognitionRouter);
router.use("/session", sessionRouter);

module.exports = router;
