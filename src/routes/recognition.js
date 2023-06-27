const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get(
  "/overview",
  middlewares.verifyAccessToken,
  controllers.recognition.getOverview
);
router.get(
  "/summary",
  middlewares.verifyAccessToken,
  controllers.recognition.getSummary
);
router.get("/current", controllers.recognition.getCurrent);
router.get("/currentTotal", controllers.recognition.getCurrentTotal);
router.get("/:id", middlewares.verifyAccessToken, controllers.recognition.get);
router.get(
  "/:id/:userId",
  middlewares.verifyAccessToken,
  controllers.recognition.getById
);
router.post("/", controllers.recognition.create);
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
