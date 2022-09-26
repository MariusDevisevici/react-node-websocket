import React, { useState } from "react";
import { Routes, Route, Redirect } from "react-router-dom";
import Auth from "./Pages/Auth";
import Chat from "./Pages/Chat";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import AdminHome from "./Admin/PagesAdmin/AdminHome";
import AdminPath from "./Admin/PagesAdmin/AdminPath";
import AdminUsers from "./Admin/PagesAdmin/AdminUsers";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Auth></Auth>}></Route>
        <Route exact path="/home" element={<Home></Home>}></Route>
        <Route exact path="/profile" element={<Profile></Profile>}></Route>
        <Route exact path="/chat" element={<Chat></Chat>}></Route>
        <Route exact path="/admin" element={<AdminPath></AdminPath>}></Route>
        <Route
          exact
          path="/admin/home"
          element={<AdminHome></AdminHome>}
        ></Route>
        <Route
          exact
          path="/admin/users"
          element={<AdminUsers></AdminUsers>}
        ></Route>
        <Route path="*" element={<Home></Home>}></Route>
      </Routes>
    </div>
  );
}

export default App;
