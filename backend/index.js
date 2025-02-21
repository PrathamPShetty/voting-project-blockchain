require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {Web3} = require("web3");
const bodyParser = require("body-parser");
const { recoverPersonalSignature } = require("@metamask/eth-sig-util");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Correct Web3 provider instantiation
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// ✅ Correct ABI import (Ensure this path is correct)
const votingABI = require("./artifacts/contracts/Voting.sol/Voting.json");

// ✅ Ensure the correct contract address is used
const contractAddress = "0xb9E91e383EC7529583017dbc1ef4cF65a7a3EbC1";

// ✅ Load the contract
const contractABI = votingABI.abi;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// ✅ Login with MetaMask Signature Verification
app.post("/login", (req, res) => {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const recoveredAddress = recoverPersonalSignature({
            data: message,
            signature: signature,
        });

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            console.log("User logged in:", address);
            return res.json({ success: true, message: "Login successful!", account: address });
        } else {
            return res.status(401).json({ success: false, message: "Signature verification failed" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Get All Candidates
app.get("/candidates", async (req, res) => {
    try {
        const candidates = await contract.methods.getAllVotesOfCandiates().call();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/vote", async (req, res) => {
    try {
        const { address, candidateIndex } = req.body;
        const tx = await contract.methods.vote(candidateIndex).send({
            from: address,
            gas: 2000000
        });
        res.json({ message: "Vote successful!", transaction: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/status", async (req, res) => {
    try {
        const status = await contract.methods.getVotingStatus().call();
        res.json({ votingOpen: status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/remaining-time", async (req, res) => {
    try {
        const timeLeft = await contract.methods.getRemainingTime().call();
        res.json({ remainingTime: timeLeft });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
