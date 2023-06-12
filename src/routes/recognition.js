const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/", middlewares.verifyAccessToken, controllers.recognition.get);
router.post("/", middlewares.verifyAccessToken, controllers.recognition.create);
router.put(
  "/:id",
  middlewares.verifyAccessToken,
  controllers.recognition.update
);
router.delete(
  "/:id",
  middlewares.verifyAccessToken,
  controllers.recognition.remove
);

module.exports = router;
