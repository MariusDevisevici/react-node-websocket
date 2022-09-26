import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./DashBoard.css";

function AdminPath() {
  const [isAdmin, setisAdmin] = useState(false);
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
  if (isAdmin)
    return (
      <div className="admin">
        <button
          className="admin__btn admin__btn--dashboard"
          onClick={() => {
            navigation("/admin/home");
          }}
        >
          Dashboard
        </button>
        <button
          className="admin__btn admin__btn--website"
          onClick={() => {
            navigation("/home");
          }}
        >
          Website
        </button>
      </div>
    );
}

export default AdminPath;
