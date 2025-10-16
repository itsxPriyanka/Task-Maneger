import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Todo from "./Pages/Todo/Todo";
import { UserProvider } from "./Pages/Context/UserContext";
import Landing from "./Pages/Landing/landing";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
