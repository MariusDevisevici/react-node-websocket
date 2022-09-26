const express = require("express");
const router = express.Router();
const mediaController = require("../controller/mediaController");

router.post(
  "/post",
  mediaController.upload.single("avatar"),
  mediaController.post
);

router.get("/get", mediaController.get);

module.exports = router;
