const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router.post("/", controllers.session.create);
router.post("/:sessionId/connections", controllers.session.createConnection);

module.exports = router;
