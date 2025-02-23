import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Guidelines from "./components/guide/guide";
import AdminPanel from "./components/index";
import './App.css';
import VotingApp from "./components/votingPage/votingPage";
import AdminLogin from "./components/adminLogin/login";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/voting" element={<VotingApp/>}/>
          <Route path="/adminlogin" element={<AdminLogin/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
