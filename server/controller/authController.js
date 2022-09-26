const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const sanitizeHtml = require("sanitize-html");
const db = require("../Models/db");

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const textRegexp = /^[a-zA-Z0-9_-]*$/;

exports.register = async (req, res, next) => {
  try {
    // db.connect((err) => {
    //   if (err) {
    //     throw err;
    //   }

    //   console.log("mysql connected");
    // });

    const email = sanitizeHtml(req.body.email);
    const password = sanitizeHtml(req.body.password);
    const username = sanitizeHtml(req.body.username);

    if (
      !email ||
      !password ||
      !username ||
      email.length < 5 ||
      password.length < 8 ||
      username.length < 8
    ) {
      res.status(400).json({
        status: "fail",
        message: "Fields empty",
      });
    } else if (
      !emailRegexp.test(email) ||
      !textRegexp.test(username) ||
      !textRegexp.test(password)
    ) {
      res.status(400).json({
        staus: "fail",
        message: "Invalid email , username or password",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (Object.keys(result).length === 0) {
            db.query(
              "INSERT INTO users (email , password , username) VALUES (?, ? , ?)",
              [email, hashedPassword, username],
              (err, result) => {
                if (err) return res.status(400);
              }
            );
            res.status(200).send("success");

            next();
          } else {
            // db.end(() => {
            //   console.log("end");
            // });
            res.status(400).json({
              staus: "fail",
              message: "Email already exists",
            });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const email = sanitizeHtml(req.body.email);
  const password = sanitizeHtml(req.body.password);
  // cookie
  // const asfa = req.headers.cookie;
  // const aab = asfa.split("=")[1];
  // console.log(aab);

  try {
    if (
      email.length === 0 ||
      password.length === 0 ||
      !emailRegexp.test(email)
    ) {
      res.json({
        staus: "fail",
        message: "Empty or invalid input",
      });
    } else {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
          if (result.length == 0)
            return res.status(400).json({
              status: "fail",
              message: "email not found",
            });
          console.log(result.length);
          let pass = result.map((a) => a.password).toString();
          const pwdv = await bcrypt.compare(password, pass);
          if (pwdv) {
            const user = result.map((a) => a.id).toString();
            const test = result.map((c) => c.username).toString();
            const role = result.map((b) => b.role).toString();
            const Accesstoken = jwt.sign(
              { user: user, test: test },
              process.env.TOKEN__SECRET,
              {
                expiresIn: "5m",
              }
            );
            const Refreshtoken = jwt.sign(
              { user: user, test: test },
              process.env.TOKEN__SECRET,
              {
                expiresIn: "1d",
              }
            );

            res
              .cookie("Accesstoken", Accesstoken, {
                httpOnly: true,
                secure: true,
                ephemeral: true,
              })
              .cookie("Refreshtoken", Refreshtoken, {
                httpOnly: true,
                secure: true,
                ephemeral: true,
              })
              .json({
                status: "success",
                message: user,
                role: role,
              });
            next();
          } else {
            res.status(400).json({
              status: "fail",
              message: "Invalid Password",
            });
          }
        }
      );
    }
  } catch (err) {
    next(err);
  }
};

// exports.session = async (req, res, next) => {
//   // const Accesstoken = req.headers.cookie.split(";")[0].split("=")[1];
//   const Accesstoken = req.cookies["Accesstoken"];
//   const Refreshtoken = req.cookies["Refreshtoken"];

//   jwt.verify(Accesstoken, process.env.TOKEN__SECRET, (err, decoded) => {
//     if (err) {
//       jwt.verify(Refreshtoken, process.env.TOKEN__SECRET, (error, decodedd) => {
//         if (error) {
//           res.send("Invalid Token");
//         } else {
//           const user = Object.entries(decodedd)[0][1];
//           db.query(
//             "SELECT id , username FROM users WHERE id=?",
//             [user],
//             async (err, result) => {
//               if (err) return res.status(400);
//               await res.send(result[0]);
//               next();
//             }
//           );
//         }
//       });
//     } else {
//       const user = Object.entries(decoded)[0][1];
//       db.query(
//         "SELECT id , username FROM users WHERE id=?",
//         [user],
//         async (err, result) => {
//           if (err) return res.status(400);
//           await res.send(result[0]);
//           next();
//         }
//       );
//     }
//   });
// };

exports.session = async (req, res, next) => {
  const Accesstoken = req.cookies["Accesstoken"];
  const Refreshtoken = req.cookies["Refreshtoken"];

  if (!Accesstoken) {
    jwt.verify(Refreshtoken, process.env.TOKEN__SECRET, (err, decoded) => {
      if (err) {
        res.send("Invalid Token");
      } else {
        const user = Object.entries(decoded)[0][1];
        const test = Object.entries(decoded)[1][1];
        const Accesstoken = jwt.sign(
          { user: user, test: test },
          process.env.TOKEN__SECRET,
          {
            expiresIn: "5m",
          }
        );
        jwt.verify(Accesstoken, process.env.TOKEN__SECRET, (err, decoded) => {
          if (err) {
            res.send("Invalid Token");
          } else {
            const user = Object.entries(decoded)[0][1];
            db.query(
              "SELECT id , username , role  FROM users WHERE id=?",
              [user],
              async (err, result) => {
                console.log(result[0]);
                if (err) return res.status(400);
                console.log(result[0]);
                await res
                  .cookie("Accesstoken", Accesstoken, {
                    httpOnly: true,
                    secure: true,
                    ephemeral: true,
                  })
                  .send(result[0]);
                next();
              }
            );
          }
        });
      }
    });
  } else {
    jwt.verify(Accesstoken, process.env.TOKEN__SECRET, (err, decoded) => {
      if (err) {
        jwt.verify(Refreshtoken, process.env.TOKEN__SECRET, (err, decoded) => {
          if (err) {
            res.send("Invalid Token");
          } else {
            const user = Object.entries(decoded)[0][1];
            const test = Object.entries(decoded)[1][1];

            const Accesstoken = jwt.sign(
              { user: user, test: test },
              process.env.TOKEN__SECRET,
              {
                expiresIn: "5m",
              }
            );
            jwt.verify(
              Accesstoken,
              process.env.TOKEN__SECRET,
              (err, decoded) => {
                if (err) {
                  res.send("Invalid Token");
                } else {
                  const user = Object.entries(decoded)[0][1];
                  db.query(
                    "SELECT id , username, role FROM users WHERE id=?",
                    [user],
                    async (err, result) => {
                      console.log(result[0]);
                      if (err) return res.status(400);
                      await res
                        .cookie("Accesstoken", Accesstoken, {
                          httpOnly: true,
                          secure: true,
                          ephemeral: true,
                        })
                        .send(result[0]);
                      next();
                    }
                  );
                }
              }
            );
          }
        });
      } else {
        const user = Object.entries(decoded)[0][1];
        db.query(
          "SELECT id , username , role FROM users WHERE id=?",
          [user],
          async (err, result) => {
            if (err) return res.status(400);
            await res.send(result[0]);
            next();
          }
        );
      }
    });
  }
};

exports.logout = async (req, res, next) => {
  res
    .cookie("Accesstoken", "Accesstoken", {
      httpOnly: true,
      secure: true,
      ephemeral: true,
    })
    .cookie("Refreshtoken", "Refreshtoken", {
      httpOnly: true,
      secure: true,
      ephemeral: true,
    })
    .send("success");
};
