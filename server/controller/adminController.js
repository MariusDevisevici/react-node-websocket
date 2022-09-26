const db = require("../Models/db");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

exports.admindata = async (req, res, next) => {
  ///USERS DATA

  db.query("SELECT * FROM users", (err, result) => {
    if (err) return next(err);
    const usersDB = result;

    ////POSTS DATA

    db.query("SELECT * FROM posts", (err, result) => {
      if (err) return next(err);

      const postsDB = result;

      ////CHAT DATA
      db.query("SELECT * FROM blog", (err, result) => {
        if (err) return next(err);
        const chatDB = result;
        res.json({
          users: usersDB.length,
          posts: postsDB.length,
          messages: chatDB.length,
        });
        next();
      });
    });
  });
};

exports.usersdata = async (req, res, next) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return next(err);
    res.send(result);
    next();
  });
};

exports.deleteuser = async (req, res, next) => {
  const user = await req.body.user;
  console.log(user);

  if (user) {
    db.query("DELETE FROM users WHERE id = ?", [user], (err, result) => {
      if (err) return next(err);
      db.query(
        "DELETE FROM posts WHERE user_id = ? ",
        [user],
        (err, result) => {
          if (err) return next(err);
          db.query(
            "DELETE FROM likes WHERE user_id = ?",
            [user],
            (err, result) => {
              if (err) return next(err);

              db.query(
                "DELETE FROM blog WHERE user_id =? ",
                [user],
                (err, result) => {
                  if (err) return next(err);
                  res.status(200).json({
                    status: "success",
                    message: "User deleted",
                  });
                  next();
                }
              );
            }
          );
        }
      );
    });
  } else {
    res.status(402).json({
      status: "fail",
      message: "User not found",
    });
  }

  // db.query("DELETE FROM users WHERE id=?", [user]);
};
