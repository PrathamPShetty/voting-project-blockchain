import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import "../../App.css";





const OnlineVoting = () => {
  const navigate = useNavigate(); 


  const playAudio = () => {
    let count = 0; // Track how many times the audio has played
  
    const playLoop = () => {
      if (count < 2) { // Play up to 3 times
        const audio = new Audio("/welcome.mp3");
        audio.currentTime = 0; // Reset audio to start
        audio.play()
          .then(() => {
            count++;
            setTimeout(playLoop, 30000); // Wait 30 seconds before playing again
          })
          .catch((error) => console.log("Audio play failed:", error));
      }
    };
  
    playLoop(); // Start playing
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      playAudio();
    }, 10000); 

    return () => clearTimeout(timeout);
  }, []);

  

  return (
    <div>
   
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">Online Voting</h1>
        </div>
        <div className="nav-right">
          <button onClick={() => navigate("/adminlogin")}>Admin</button>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/guidelines")}>Guidelines</button>

          {/* User Profile Section */}
          <div className="profile-container">
            <div className="profile-icon">
              <img src="/image.png" alt="Profile" className="profile-img" />
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
    <button className="speak-button" onClick={playAudio}>
  🔊 Hear Instructions
</button>
  </div>
</div>

    </div>
  );
};

export default OnlineVoting;