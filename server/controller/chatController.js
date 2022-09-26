const db = require("../Models/db");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

exports.sendMessage = async (req, res, next) => {
  const post = req.body.post;
  const token = req.cookies["Refreshtoken"];
  ///Check post and token
  if (post.length > 0 && post.length < 500 && token) {
    jwt.verify(token, process.env.TOKEN__SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid Token",
        });
      } else {
        const user = decoded.user;
        const username = decoded.test;

        ///test

        db.query(
          "INSERT INTO blog (message , user_id , username) VALUES (? , ? , ?)",
          [post, user, username],
          (err, result) => {
            console.log("ok");
          }
        );

        res.send("ok");
        next();
      }
    });
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Empty fields",
    });
  }
};

exports.getMessages = async (req, res, next) => {
  db.query("SELECT message, username FROM blog", (err, ress) => {
    const msg = ress.map((e) => e.message);
    console.log(ress);
    res.send(ress);
    next();
  });
};
