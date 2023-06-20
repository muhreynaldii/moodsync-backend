const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/me", middlewares.verifyAccessToken, controllers.users.me);
router.get("/username/ids", controllers.users.getIds);
router.get("/username/:username", controllers.users.getByUsername);
router.get("/testt", controllers.users.testt);
router.post("/test", controllers.users.test);

module.exports = router;
