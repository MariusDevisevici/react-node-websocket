const db = require("../Models/db");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

exports.getuserposts = async (req, res, next) => {
  const token = req.cookies["Accesstoken"];
  if (token) {
    jwt.verify(token, process.env.TOKEN__SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid Token",
        });
      } else {
        const user = decoded.user;

        db.query(
          "SELECT * FROM posts WHERE user_id=?",
          [user],
          (err, result) => {
            if (err) {
              return res.status(404).json({
                status: "fail",
                message: "Posts not found",
              });
            } else {
              res.send(result);
              next();
            }
          }
        );
      }
    });
  } else {
    res.status(501);
  }
};

exports.like = async (req, res, next) => {
  const token = await req.cookies["Accesstoken"];
  const post = await req.body.posts;
  if (token && post) {
    try {
      jwt.verify(token, process.env.TOKEN__SECRET, (err, decoded) => {
        if (err) {
          return res.status(400).json({
            status: "fail",
            message: "Invalid Token",
          });
        } else {
          const id = Object.entries(decoded)[0][1];
          db.query(
            "SELECT * FROM likes WHERE user_id = ? and post_id = ?",
            [id, post],
            (err, ress) => {
              if (Object.entries(ress).length === 0) {
                db.query(
                  "INSERT INTO likes (user_id, post_id )VALUES (? , ?)",
                  [id, post],
                  (err, ress) => {
                    if (err) {
                      return console.log(err);
                    } else {
                      db.query(
                        "SELECT * FROM likes WHERE post_id = ?",
                        [post],
                        (err, result) => {
                          if (err) {
                            console.log(err);
                          } else {
                            const likesNumber = Object.keys(result).length;
                            db.query(
                              `UPDATE posts SET likes=${likesNumber} WHERE id=${post}`
                            );
                          }
                        }
                      );
                      res.send("ok");
                    }
                  }
                );
              } else if (err) {
                return res.send(err);
              } else {
                db.query(
                  "DELETE FROM likes WHERE user_id=? and post_id=?",
                  [id, post],
                  (err, result) => {
                    if (err) {
                      return console.log(err);
                    } else {
                      db.query(
                        "SELECT * FROM likes WHERE post_id = ?",
                        [post],
                        (err, result) => {
                          if (err) {
                            return console.log(err);
                          } else {
                            const likesNumber = Object.keys(result).length;
                            db.query(
                              `UPDATE posts SET likes=${likesNumber} WHERE id=${post}`
                            );
                          }
                        }
                      );
                    }
                  }
                );
                res.send("ok");
                next();
              }
            }
          );
        }
      });
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  } else {
    res.send("empty field");
    next();
  }
};
