import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
function AdminUsers() {
  const [data, setData] = useState();
  const [user, setUser] = useState();
  let navigation = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:8000/usersdata")
      .then(async (res) => {
        const a = await res.data;
        setData(a);
        console.log(a);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:8000/session", {
      withCredentials: true,
    }).then((res) => {
      if (res.data !== "Invalid Token") {
        const role = res.data.role;
        if (role !== "admin") {
          navigation("/home", { replace: true });
        }
      } else {
        navigation("/", {
          replace: true,
        });
      }
    });
  }, []);

  const deleteUserHandler = (ceva) => {
    Axios.post("http://localhost:8000/deleteuser", { user: ceva })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="users__data">
      {data &&
        data.map((e) => (
          <div className="patrat" key={e.id}>
            <span className="patrat__id">
              <MdDeleteForever
                className="patrat__delete"
                onClick={async () => {
                  const ceva = await e.id;

                  deleteUserHandler(ceva);
                }}
              ></MdDeleteForever>
              {e.id}
            </span>
            <span className="patrat__email">{e.email}</span>
            <span className="patrat__username">{e.username}</span>
            <span className="patrat__role">
              {e.role} <AiTwotoneEdit className="patrat__edit"></AiTwotoneEdit>
            </span>
          </div>
        ))}
    </div>
  );
}

export default AdminUsers;
