import { useEffect, useState } from "react";
import Web3 from "web3"; // Import Web3 for MetaMask connection
import "./login.css"; // Import CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VoterLogin = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState(""); // Batch selection
  const [voterIdError, setVoterIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [batchError, setBatchError] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    getBatches();
  }, []);

  const getBatches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getbatches");
      setBatches(response.data?.batches || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!/^\d{12}$/.test(voterId)) {
      setVoterIdError("Please enter a valid 12-digit Voter ID.");
      isValid = false;
    } else {
      setVoterIdError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!batch) {
      setBatchError("Please select a batch.");
      isValid = false;
    } else {
      setBatchError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", { voterId, password, batch });
      // Proceed with API call, etc.
    }
  };

  const connectMetaMask = async () => {
    if (!batch) {
      setBatchError("Please select a batch.");
      return;
    }

    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
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
        navigate("/voting", { state: { account: response.data.account, batch } });
      } else {
        alert("Login failed! Please check your wallet details.");
      }

      console.log("Backend Response:", response.data);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      alert("Failed to connect with MetaMask. Please try again.");
    }
  };

  return (
    <div className="flex" style={{ margin: "250px 0" }}>
      <div className="bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">Voter Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Voter ID Number:</label>
            <input
              type="text"
              placeholder="Enter your Voter ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              required
            />
            {voterIdError && <span className="text-red-500">{voterIdError}</span>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <span className="text-red-500">{passwordError}</span>}
          </div>
        
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-600">
              Submit
            </button>
            <button type="button" className="bg-gray-500" onClick={() => window.history.back()}>
              Back
            </button>
          </div>
          <br/>
          <div className="mb-4">
            <label className="block font-semibold">Select Batch:</label>
            <select value={batch} onChange={(e) => setBatch(e.target.value)} required>
              <option value="">Select Batch</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch.name}>
                  {batch.name}
                </option>
              ))}
            </select>
            {batchError && <span className="text-red-500">{batchError}</span>}
          </div>
          <br/>
        </form>
        <div className="mt-4 text-center">
          <button className="bg-orange-500 px-4 py-2 rounded" onClick={connectMetaMask}>
            Connect to MetaMask
          </button>
          {walletAddress && <p className="mt-2 text-green-600">Connected: {walletAddress}</p>}
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;
