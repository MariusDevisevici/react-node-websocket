const db = require("../Models/db");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

exports.post = async (req, res, next) => {
  const file = req.file;
  const Accesstoken = req.cookies["Accesstoken"];
  const Refreshtoken = req.cookies["Refreshtoken"];

  if (file) {
    const fileName = file.filename;

    jwt.verify(Accesstoken, process.env.TOKEN__SECRET, (err, decoded) => {
      if (err) {
        jwt.verify(Refreshtoken, process.env.TOKEN__SECRET, (err, decoded) => {
          if (err) {
            return res.send(err);
          } else {
            const user = Object.entries(decoded)[0][1];
            const username = Object.entries(decoded)[1][1];
            db.query(
              "INSERT INTO posts (user_id , post ,username)  VALUES (? , ? ,?)",
              [user, fileName, username],
              (err, result) => {
                if (err) {
                  res.send(err);
                  next(err);
                } else {
                  res.send("success");
                  next();
                }
              }
            );
          }
        });
      } else {
        const user = Object.entries(decoded)[0][1];
        const username = Object.entries(decoded)[1][1];
        db.query(
          "INSERT INTO posts (user_id , post , username)  VALUES (? , ? , ?)",
          [user, fileName, username],
          (err, result) => {
            if (err) {
              res.send(err);
              next(err);
            } else {
              res.send("success");
              next();
            }
          }
        );
      }
    });
  } else {
    res.send("enpty");
  }
};

exports.get = (req, res, next) => {
  db.query("SELECT * FROM posts", (err, result) => {
    if (err) {
      return res.send("error");
    } else if (Object.keys(result).length > 0) {
      const ceva = Object.entries(result);
      res.send(ceva);
      next();
    }
  });
};
