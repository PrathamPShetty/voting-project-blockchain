require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Web3 } = require("web3");
const bodyParser = require("body-parser");
const { recoverPersonalSignature } = require("@metamask/eth-sig-util");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Function to safely serialize BigInt values
function safeJSON(obj) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

// ✅ Ensure Web3 connects to the correct Ganache RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7546"));

// ✅ Correct ABI import (Ensure this path is correct)
const votingABI = require("./artifacts/contracts/Voting.sol/Voting.json");

// ✅ Ensure the correct contract address is used
const contractAddress = "0xb9E91e383EC7529583017dbc1ef4cF65a7a3EbC1";
const contractABI = votingABI.abi;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// ✅ User Login Route (Signature Verification)
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

// ✅ Get All Candidates (Fix: Correct Function Name)
app.get("/candidates", async (req, res) => {
    try {
        const candidates = await contract.methods.getAllVotesOfCandiates().call();
        console.log("Candidates:", candidates);
        res.json(safeJSON(candidates)); // ✅ Use safeJSON() to prevent BigInt errors
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Voting Route (User Votes for a Candidate)
app.post("/vote", async (req, res) => {
    try {
        console.log("voting is started");
        const { address, candidateIndex } = req.body;
        const tx = await contract.methods.vote(candidateIndex).send({
            from: address,
            gas: 2000000,
        });
        res.json({ message: "Vote successful!", transaction: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Voting Status (Open or Closed)
app.get("/status", async (req, res) => {
    try {
        const status = await contract.methods.getVotingStatus().call();
        res.json({ votingOpen: status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Remaining Voting Time (Fix: Handle BigInt)
app.get("/remaining-time", async (req, res) => {
    try {
        const timeLeft = await contract.methods.getRemainingTime().call();
        res.json({ remainingTime: timeLeft.toString() }); // ✅ Convert BigInt to string
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
