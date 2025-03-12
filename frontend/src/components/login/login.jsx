import { useEffect, useState } from "react";
import Web3 from "web3"; // Import Web3 for MetaMask connection
import "./login.css"; // Import CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const VoterLogin = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState(""); // Batch selection
  const [walletAddress, setWalletAddress] = useState(null);
  const [batches, setBatches] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();

  const playAudio = () => {
    let count = 0; 

    const playLoop = () => {
      if (count < 2) { 
        const audio = new Audio("/login.mp3");
        audio.currentTime = 0;
        audio.play()
          .then(() => {
            count++;
            setTimeout(playLoop, 60000);
          })
          .catch((error) => console.log("Audio play failed:", error));
      }
    };

    playLoop();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      playAudio();
    }, 20000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    getBatches();
  }, []);

  const getBatches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getallbatches");
      setBatches(response.data?.batches || []);
    } catch (error) {
      showAlert("Error fetching batches", "error");
    }
  };

  const validateForm = () => {
    if (!/^\d{12}$/.test(voterId)) {
      showAlert("Please enter a valid 12-digit Voter ID.", "error");
      return false;
    }

    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "error");
      return false;
    }

    if (!batch) {
      showAlert("Please select a batch.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      showAlert("Form submitted successfully!", "success");
    }
  };

  const connectMetaMask = async () => {
    if (!batch) {
      showAlert("Please select a batch.", "error");
      return;
    }

    if (!window.ethereum) {
      showAlert("MetaMask is not installed. Please install it to continue.", "error");
      return;
    }

    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      setWalletAddress(userAddress);
      console.log("Connected Wallet Address:", userAddress);

      const message = `Login to My App ${new Date().toISOString()}`;
      const signature = await web3.eth.personal.sign(message, userAddress, "");

      const response = await axios.post("http://localhost:5000/login", {
        address: userAddress,
        signature,
        message,
      });

      if (response.data.success) {
        showAlert("Login successful!", "success");
        navigate("/voting", { state: { account: response.data.account, batch } });
      } else {
        showAlert("Login failed! Please check your wallet details.", "error");
      }
    } catch (error) {
      showAlert("Failed to connect with MetaMask. Please try again.", "error");
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setOpenAlert(true);
  };

  return (
    <div className="flex" style={{ margin: "250px 0" }}>
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={alertType} variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>

      <div className="bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">Voter Login</h2>

        <div className="mb-4">
          <label className="block font-semibold">Select Batch:</label>
          <select 
            className="w-full border p-2 rounded" 
            value={batch} 
            onChange={(e) => setBatch(e.target.value)} 
            required
          >
            <option value="">Select Batch</option>
            {batches.map((batch, index) => (
              <option key={index} value={batch.name}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>

        <br/>

        <div className="mt-4 text-center">
          <button className="bg-orange-500 px-4 py-2 rounded" onClick={connectMetaMask}>
            Connect to MetaMask
          </button>
          {walletAddress && <p className="mt-2 text-green-600">Connected: {walletAddress}</p>}
        </div>
        <br />
        <div>
        <button className="speak-button" onClick={playAudio}  style={{ marginRight: "20px" }}>
          🔊 Hear Instructions
        </button>

       
<button className="speak-button" onClick={() => navigate("/")}>
  Back
</button>
      </div>
      </div>
    </div>
  );
};

export default VoterLogin;
