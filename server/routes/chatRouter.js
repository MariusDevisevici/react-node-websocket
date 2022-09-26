const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
router.post("/sendmessage", chatController.sendMessage);
router.get("/getmessages", chatController.getMessages);
module.exports = router;
