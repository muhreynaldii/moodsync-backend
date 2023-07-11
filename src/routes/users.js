const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/me", middlewares.verifyAccessToken, controllers.users.me);
router.get("/count", middlewares.verifyAccessToken, controllers.users.getCount);
router.get("/username/ids", controllers.users.getIds);
router.get("/username/:username", controllers.users.getByUsername);
router.get("/:id", middlewares.verifyAccessToken, controllers.users.getById);
router.get("/:id/overview", middlewares.verifyAccessToken, controllers.users.getOverview);
router.get("/:id/summary", middlewares.verifyAccessToken, controllers.users.getSummary);
router.get("/", controllers.users.getAllUsers);
router.post("/", controllers.users.postNewUsers);
router.put("/:id", middlewares.verifyAccessToken, controllers.users.update);
router.delete("/:id", middlewares.verifyAccessToken, controllers.users.remove);

module.exports = router;
