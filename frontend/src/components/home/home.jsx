import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import "../../App.css";

const OnlineVoting = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">Online Voting</h1>
        </div>
        <div className="nav-right">
          <button onClick={() => navigate("/admin")}>Admin</button>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/guidelines")}>Guidelines</button>

          {/* User Profile Section */}
          <div className="profile-container">
            <div className="profile-icon">
              <img src="vishnu2.png" alt="Profile" className="profile-img" />
            </div>
          </div>
        </div>
      </nav>
      <div style={{ margin: "200px 0" }}>
  <div className="container">
    <div className="card">
      <h2>Welcome to Online Voting</h2>
      <p>Cast your vote securely with blockchain technology.</p>
    </div>
  </div>
</div>

    </div>
  );
};

export default OnlineVoting;
