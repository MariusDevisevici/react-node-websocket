import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000");
function ChatForm({ post, setPost, setMessage }) {
  const input = useRef();
  const [updatePosts, setUpdatePosts] = useState(true);
  const chatHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/sendmessage",
        { post: post },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setPost("");
        input.current.value = "";
        setUpdatePosts((prev) => !prev);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:8000/getmessages").then((data) => {
      socket.emit("send_message", data.data);
    });
  }, [updatePosts]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessage(data);
    });
  }, []);

  return (
    <>
      <div className="chat__form">
        <form className="form" onSubmit={chatHandler}>
          <input
            ref={input}
            onChange={(e) => {
              setPost(e.target.value);
            }}
            placeholder="Write Here..."
            type="text"
            max="500"
          ></input>
          <button type="submit">
            <svg
              width="30"
              height="32"
              viewBox="0 0 30 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.91769 19.0701L2.91762 19.0701L2.91847 19.0758C3.4772 22.7814 3.66945 26.533 3.49248 30.2763L3.49223 30.2763V30.287C3.49223 30.5406 3.63431 30.7162 3.81468 30.7977C3.95964 30.976 4.23024 31.1277 4.5171 30.984C13.2006 27.2485 21.2878 22.2606 28.5215 16.1806L28.6994 16.1758C28.9241 16.1746 29.0925 16.0573 29.1826 15.8956C29.2409 15.791 29.2656 15.6707 29.2585 15.5537C29.4107 15.4088 29.4574 15.22 29.4128 15.0443C29.3807 14.9178 29.3043 14.8083 29.2062 14.7292C29.1685 14.5842 29.0637 14.4599 28.8957 14.3916C19.5877 10.3462 10.4388 5.94022 1.44902 1.1738C1.17184 1.02557 0.899701 1.12904 0.744313 1.30306C0.707665 1.33917 0.675655 1.38028 0.64938 1.42553C0.572129 1.55857 0.550638 1.71676 0.58959 1.86556C1.67073 6.20681 2.32278 10.6438 2.53635 15.1125C2.5378 15.2694 2.59653 15.4039 2.6952 15.502C2.78061 15.587 2.88768 15.6368 2.99454 15.6579C3.06072 15.6884 3.13377 15.7066 3.21179 15.7115C8.67392 16.0635 14.1596 16.2525 19.6687 16.2785L3.47853 18.1833C3.27642 18.1882 3.12367 18.2946 3.03427 18.4353C2.95918 18.5535 2.92794 18.6951 2.93629 18.8284C2.9143 18.9036 2.90705 18.985 2.91769 19.0701ZM2.00394 2.77156C10.3515 7.18382 18.8607 11.2767 27.5317 15.0501C19.5764 15.2364 11.6211 15.0811 3.66579 14.5839C3.45188 10.6056 2.8958 6.65359 2.00394 2.77156ZM4.10826 19.2676L26.104 16.6799C19.5597 21.9241 12.3543 26.2909 4.67041 29.6667C4.79291 26.1906 4.6048 22.7104 4.10826 19.2676Z"
                fill="#000000"
                stroke="#000000"
                strokeWidth="0.452541"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatForm;
