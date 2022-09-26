const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");

router.get("/getuserposts", UserController.getuserposts);
router.post("/likepost", UserController.like);
module.exports = router;
