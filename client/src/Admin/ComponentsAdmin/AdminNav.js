import React from "react";
import { FiUsers } from "react-icons/fi";
import { BsImages, BsChatSquareText } from "react-icons/bs";
import { NavLink } from "react-router-dom";
function AdminNav() {
  return (
    <>
      <div className="dashboard__nav">
        <ul className="dashboard__list">
          <NavLink to="/admin/users" className="dashboard__item">
            <FiUsers></FiUsers>
          </NavLink>
          <li className="dashboard__item">
            <BsImages></BsImages>
          </li>
          <li className="dashboard__item">
            <BsChatSquareText></BsChatSquareText>
          </li>
        </ul>
      </div>
    </>
  );
}

export default AdminNav;
