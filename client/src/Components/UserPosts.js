import React, { useEffect, useState, Suspense } from "react";
import Axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";

function UserPosts() {
  const [userposts, setUserposts] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8000/getuserposts", {
      withCredentials: true,
    })
      .then((res) => {
        const x = res.data.map((e) => ({
          id: e.id,
          posts: e.post,
          likes: e.likes,
        }));
        setUserposts(x);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (userposts.length > 0) {
    return (
      <>
        <Suspense
          fallback={
            <>
              <h1>Loading...</h1>
            </>
          }
        >
          <div className="posts">
            {userposts.map((e) => (
              <div key={e.id} className="img">
                <img src={`http://localhost:8000/${e.posts}`}></img>
                <span className="likes">
                  <AiOutlineHeart></AiOutlineHeart>
                  {e.likes}
                </span>
              </div>
            ))}
          </div>
        </Suspense>
      </>
    );
  } else {
    return <h1>No posts</h1>;
  }
}

export default UserPosts;
