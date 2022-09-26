import React, { useState, useEffect } from "react";
import ChatForm from "../Components/ChatForm";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Chat.css";
function Chat() {
  const [post, setPost] = useState("");
  const [err, setErr] = useState("");
  const [message, setMessage] = useState([]);

  let navigation = useNavigate();
  ///Check session
  useEffect(() => {
    Axios.get("http://localhost:8000/session", {
      withCredentials: true,
    }).then((res) => {
      if (res.data === "Invalid Token") {
        navigation("/", {
          replace: true,
        });
      }
    });
  }, []);
  return (
    <>
      <div className="chat">
        <div className="chat__messages">
          <h1>Chat</h1>

          {message.map((el, i) => {
            return (
              <div className="chat__box" key={i}>
                <span className="chat__username">{el.username}:</span>
                <span className="chat__message"> {el.message}</span>
              </div>
            );
          })}
          <ChatForm
            setMessage={setMessage}
            setPost={setPost}
            post={post}
          ></ChatForm>
        </div>
      </div>
    </>
  );
}

export default Chat;
