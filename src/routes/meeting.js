const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/", middlewares.verifyAccessToken, controllers.meeting.get);
router.post("/", middlewares.verifyAccessToken, controllers.meeting.create);
router.put("/:id", middlewares.verifyAccessToken, controllers.meeting.update);
router.delete(
  "/:id",
  middlewares.verifyAccessToken,
  controllers.meeting.remove
);

module.exports = router;
