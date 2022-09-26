import { useState } from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsFillChatDotsFill } from "react-icons/bs";
import Chat from "../Pages/Chat";
import "./Nav.css";
function Nav() {
  const [chat, setChat] = useState(false);
  let navigation = useNavigate();
  const logoutHandler = (e) => {
    Axios.get("http://localhost:8000/logout", {
      withCredentials: true,
    }).then((res) => {
      if (res.data === "success") {
        navigation("/", {
          replace: true,
        });
      }
    });
  };

  const chatHandler = () => {
    setChat(!chat);
  };

  return (
    <>
      <nav className="nav">
        {/* <div className=" nav__logo">
          <img
            src="318-3189431_apiary-beehive-icon-removebg-preview-removebg-preview.png"
            alt=""
          />
        </div> */}
        <ul className="nav__list">
          <li className="nav__item">
            <NavLink to="/home">Home</NavLink>
          </li>
          <li className="nav__item">
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li className="nav__item nav__item--right" onClick={chatHandler}>
            <BsFillChatDotsFill></BsFillChatDotsFill>
          </li>
          <li className="nav__item nav__item--button" onClick={logoutHandler}>
            <a> Logout</a>
          </li>
        </ul>
      </nav>

      {chat && <Chat></Chat>}
    </>
  );
}

export default Nav;
