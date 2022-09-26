import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Nav from "../Components/Nav";
import UserPosts from "../Components/UserPosts";
import { AiOutlineUser } from "react-icons/ai";

import "./Profile.css";
function Profile() {
  let navigation = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:8000/session", {
      withCredentials: true,
    }).then((res) => {
      if (res.data === "Invalid Token") {
        navigation("/", {
          replace: true,
        });
      } else {
        setUser(res.data.username);
      }
    });
  }, []);

  return (
    <>
      <Nav></Nav>

      <div className="profile">
        <h1 className="profile__user">
          <AiOutlineUser></AiOutlineUser>
          {user}
        </h1>
      </div>
      <h1 className="posts__title">Your posts</h1>
      <UserPosts></UserPosts>
    </>
  );
}

export default Profile;
