const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

router.get("/admindata", adminController.admindata);
router.get("/usersdata", adminController.usersdata);
router.post("/deleteuser", adminController.deleteuser);
module.exports = router;
