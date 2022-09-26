import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./DashBoard.css";

import AdminNav from "../ComponentsAdmin/AdminNav";
function AdminHome() {
  const [isAdmin, setisAdmin] = useState(false);
  const [usersNumber, setUsersNumber] = useState("");
  const [postsNumber, setPostsNumber] = useState("");
  const [messagesNumber, setMessagesNumber] = useState("");

  let navigation = useNavigate();
  useEffect(() => {
    Axios.get("http://localhost:8000/session", {
      withCredentials: true,
    }).then((res) => {
      if (res.data !== "Invalid Token") {
        const role = res.data.role;
        if (role !== "admin") {
          navigation("/home", { replace: true });
        } else {
          setisAdmin(true);
        }
      } else {
        navigation("/", {
          replace: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:8000/admindata").then((res) => {
      console.log(res.data);
      setUsersNumber(res.data.users);
      setPostsNumber(res.data.posts);
      setMessagesNumber(res.data.messages);
    });
  }, []);

  if (isAdmin)
    return (
      <div className="dashboard">
        <div className="dashboard__main">
          <div className="dashboard__grid">
            <div className="dashboard__card dashboard__card--users">
              <span className="number">{usersNumber}</span>
              <p>Users</p>
            </div>
            <div className="dashboard__card dashboard__card--posts">
              <span className="number">{postsNumber}</span>
              <p>Posts</p>
            </div>
            <div className="dashboard__card dashboard__card--messages">
              <span className="number">{messagesNumber}</span>
              <p>Messages</p>
            </div>
            <div className="dashboard__card">31</div>
          </div>
          <AdminNav></AdminNav>
        </div>
      </div>
    );
}

export default AdminHome;
