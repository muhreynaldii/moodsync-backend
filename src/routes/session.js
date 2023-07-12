const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router.post("/", controllers.session.create);
router.post("/:sessionId/connections", controllers.session.createConnection);
router.delete("/:sessionId", controllers.session.removeSession);
router.delete("/:sessionId/connection/:connectionId", controllers.session.removeConnection);

module.exports = router;
