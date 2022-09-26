import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Nav from "../Components/Nav";
import "./Home.css";
import Posts from "../Components/Posts";
function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let navigation = useNavigate();
  //checking token
  useEffect(() => {
    Axios.get("http://localhost:8000/session", {
      withCredentials: true,
    }).then((res) => {
      if (res.data === "Invalid Token") {
        navigation("/", {
          replace: true,
        });
      } else {
        setIsLoggedIn(true);
      }
    });
  }, []);
  /////
  if (isLoggedIn) {
    return (
      <>
        <Nav></Nav>
        <Posts></Posts>
      </>
    );
  } else return <> </>;
}

export default Home;
