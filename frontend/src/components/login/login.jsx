import { useState } from "react";
import Web3 from "web3"; // Import Web3 for MetaMask connection
import "./login.css"; // Import CSS

const VoterLogin = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [voterIdError, setVoterIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Validate Voter ID (12-digit number)
    if (!/^\d{12}$/.test(voterId)) {
      setVoterIdError("Please enter a valid 12-digit Voter ID.");
      isValid = false;
    } else {
      setVoterIdError("");
    }

    // Validate Password (Minimum 6 characters)
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", { voterId, password });
      // Proceed with form submission logic (API call, etc.)
    }
  };

  // MetaMask Connection
  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]); // Store connected wallet address
        console.log("Connected Wallet Address:", accounts[0]);
      } catch (error) {
        console.error("User denied MetaMask connection.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  return (
    <div className="flex" style={{ margin: "250px 0" }}>
      <div className="bg-white" >
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
            <button type="submit" className="bg-blue-600">Submit</button>
            <button type="button" className="bg-gray-500" onClick={() => window.history.back()}>
              Back
            </button>
          </div>
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
