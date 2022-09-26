import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Masonry from "@mui/lab/Masonry";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";

function Posts() {
  const [image, setImage] = useState("");
  const [posts, setPosts] = useState([]);
  const fileInput = useRef();
  const [filter, setFilter] = useState(20);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [update, setUpdate] = useState(false);

  let navigation = useNavigate();
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
    console.log("loop");
  }, [image]);

  ///upload handler
  const uploadHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("avatar", image);

    await fetch("http://localhost:8000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    })
      .then((fileInput.current.value = null))
      .then(setImage(""))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/get").then((res) => {
      const a = res.data.map((c) => ({
        id: c[1].id,
        user: c[1].username,
        post: c[1].post,
        likes: c[1].likes,
      }));

      setPosts(a);
      setVisiblePosts(a.slice(0, filter));
    });
    console.log("loop");
  }, [image, update]);

  const testHandler = () => {
    if (posts.length > filter) {
      setFilter((prevfilter) => prevfilter + 10);
    }
  };

  useEffect(() => {
    setVisiblePosts(posts.slice(0, filter));
    console.log("loop");
  }, [filter]);

  const likeHandler = (e) => {
    Axios.post(
      "http://localhost:8000/likepost",
      { posts: e.target.id },
      {
        withCredentials: true,
      }
    ).then((res) => {
      setUpdate((prev) => !prev);
      console.log(res);
    });
  };

  return (
    <>
      <form
        className="formfile"
        encType="multipart/form-data"
        onSubmit={uploadHandler}
      >
        <input
          className="form__input form__input--file"
          ref={fileInput}
          name="avatar"
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <button className="form__uploadbtn" type="submit">
          Click
        </button>
      </form>
      <div className="feed">
        <Masonry columns={{ xs: 1, sm: 3, md: 5, lg: 7 }} spacing={3}>
          {posts.length > 0 &&
            visiblePosts.map((el) => {
              return (
                <div className="feed__card" key={el.id}>
                  <img
                    id={el.id}
                    src={`http://localhost:8000/${el.post}`}
                    className="feed__image"
                    onClick={likeHandler}
                  ></img>
                  <div className="feed__info">
                    <span className="user">
                      <AiOutlineUser></AiOutlineUser>
                      {el.user}
                    </span>
                    <span className="likess">
                      {el.likes}
                      <AiOutlineHeart></AiOutlineHeart>
                    </span>
                  </div>
                </div>
              );
            })}
        </Masonry>
        {posts.length > filter && (
          <button className="feed__button" onClick={testHandler}>
            Show more
          </button>
        )}
      </div>
    </>
  );
}

export default Posts;
