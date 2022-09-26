import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Auth.css";
function auth() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailreg, setemailreg] = useState("");
  const [passwordreg, setpasswordreg] = useState("");
  const [err, seterr] = useState();
  const [regerr, setregerr] = useState("");
  const [logged, setLogged] = useState(true);
  let navigation = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:8000/session", {
      withCredentials: true,
    }).then((res) => {
      if (res.data !== "Invalid Token") {
        setLogged(true);
        navigation("/home", {
          replace: true,
        });
      } else {
        setLogged(false);
      }
    });
  }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    if (!email || !password) return seterr("Empty fields");
    if (email.length < 5) return seterr("Use at least 5 characters for Email");
    if (password.length < 8)
      return seterr("Use at least 8 characters for Password");

    Axios.post(
      "http://localhost:8000/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    )
      .then(async (res) => {
        console.log(res.data);
        setemail("");
        setpassword("");
        const ceva = res.data.role;
        await ceva;
        if (ceva === "admin") {
          navigation("/admin", {
            replace: true,
          });
        } else {
          navigation("/home", {
            replace: true,
          });
        }
      })
      .catch((err) => {
        seterr(err.response.data.message);
        console.log(err.response.data.message);
      });
  };
  const registerHandler = (e) => {
    e.preventDefault();
    Axios.post(
      "http://localhost:8000/register",
      { username: username, email: emailreg, password: passwordreg },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        if (res.data === "success") {
          setUsername("");
          setemailreg("");
          setpasswordreg("");
          setregerr("Success");
        } else {
        }
      })
      .catch((error) => {
        if (error.response) {
          setregerr(error.response.data.message);
        }
      });
  };

  if (logged) {
    return <></>;
  }
  if (!logged) {
    return (
      <div className="container">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "white",
          }}
        >
          Login or Register
        </h1>
        <form className="form" onSubmit={loginHandler}>
          <div className="form__group">
            <input
              type="email"
              onChange={(e) => {
                setemail(e.target.value);
              }}
              value={email}
              placeholder="Email"
              className="form__control"
              id="loginemail"
              required
            />
            <label htmlFor="loginemail" className="form__label">
              Email
            </label>
          </div>
          <div className="form__group">
            <input
              type="password"
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              value={password}
              id="loginpassword"
              className="form__control"
              placeholder="Password"
              required
            />
            <label htmlFor="loginpassword" className="form__label">
              Password
            </label>
          </div>
          <button className="form__button" type="submit">
            Login
          </button>
          <p className="error">{err}</p>
        </form>
        <form className="form" onSubmit={registerHandler}>
          <div className="form__group">
            <input
              type="text"
              name="username"
              id="registername"
              className="form__control"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
            <label htmlFor="registername" className="form__label">
              Username
            </label>
          </div>
          <div className="form__group">
            <input
              type="email"
              name="email"
              id="registeremail"
              className="form__control"
              placeholder="Email"
              value={emailreg}
              onChange={(e) => {
                setemailreg(e.target.value);
              }}
              required
            />
            <label htmlFor="registeremail" className="form__label">
              Email
            </label>
          </div>
          <div className="form__group">
            <input
              type="password"
              name="password"
              id="registerpassword"
              className="form__control"
              placeholder="Password"
              value={passwordreg}
              onChange={(e) => {
                setpasswordreg(e.target.value);
              }}
              required
            />
            <label htmlFor="registerpassword" className="form__label">
              Password
            </label>
          </div>
          <button className="form__button" type="submit">
            Register
          </button>
          <p className="error">{regerr}</p>
        </form>
      </div>
    );
  }
}

export default auth;
