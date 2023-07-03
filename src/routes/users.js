const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/me", middlewares.verifyAccessToken, controllers.users.me);
router.get("/:id", middlewares.verifyAccessToken, controllers.users.getById);
router.get("/:id/overview", middlewares.verifyAccessToken, controllers.users.getOverview);
router.get("/:id/summary", middlewares.verifyAccessToken, controllers.users.getSummary);
router.get("/username/ids", controllers.users.getIds);
router.get("/username/:username", controllers.users.getByUsername);
router.get("/", controllers.users.getAllUsers);
router.post("/", controllers.users.postNewUsers);

module.exports = router;
