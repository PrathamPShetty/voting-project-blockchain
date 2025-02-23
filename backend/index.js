require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Web3 } = require("web3");
const { v4: uuidv4 } = require("uuid");
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
const contractAddress = "0xc063758D97ADFf6e7d11414e18A3A6D2B76a4C17";
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
        console.log("Voting is started");
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

// ✅ Create a Voting Batch
app.post("/create-batch", async (req, res) => {
    try {
        const { batchName, senderAddress } = req.body;
        const candidateNames = ['nota'];
        const durationInMinutes = 60;

        if (!batchName || !candidateNames || !durationInMinutes || !senderAddress) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log("Creating batch with:", { batchName, candidateNames, durationInMinutes, senderAddress });

        // ✅ Pass parameters separately
        const tx = await contract.methods.createBatch(batchName, candidateNames, durationInMinutes).send({
            from: senderAddress,
            gas: 2000000,
        });

        res.json({ success: true, message: "Batch created successfully!", transaction: tx.transactionHash });
    } catch (error) {
        console.error("Batch creation error:", error);
        res.status(500).json({ error: error.message });
    }
});


app.post("/start-voting", async (req, res) => {
    try {
        const { batchId, senderAddress } = req.body;

        if (!batchId || !senderAddress) {
            return res.status(400).json({ success: false, error: "Missing batchId or senderAddress" });
        }

        const tx = await contract.methods.startVoting(batchId).send({
            from: senderAddress,
            gas: 2000000,
        });

        res.json({ success: true, message: "Voting started successfully!", transaction: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



app.post("/stop-voting", async (req, res) => {
    try {
        const { batchId, senderAddress } = req.body;

        if (!batchId || !senderAddress) {
            return res.status(400).json({ success: false, error: "Missing batchId or senderAddress" });
        }

        const tx = await contract.methods.stopVoting(batchId).send({
            from: senderAddress,
            gas: 2000000,
        });

        res.json({ success: true, message: "Voting stopped successfully!", transaction: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



async function getAllBatches() {
    try {
        const totalBatches = await contract.methods.getTotalBatches().call();
        let batchList = [];

       

        for (let batchId = 1; batchId <= totalBatches; batchId++) {
            const batchData = await contract.methods.getBatch(batchId).call();
            
            let candidates = batchData[1].map(candidate => ({
                name: candidate.name,
                voteCount: candidate.voteCount
            }));

            batchList.push({
                batchId,
                name: batchData[0], // Assuming batch name is at index 0
                candidates
            });
        }

        // console.log(batchList);

         
        if (!batchList || batchList.length === 0) {
            return []; // Return an empty array if no batches exist
        }

        return batchList;
    } catch (error) {
        console.error("Error fetching batches:", error);
        return [];
    }
}

// REST API route to get all batches
app.get("/getbatches", async (req, res) => {
    try {
        let batches = await getAllBatches();
        // console.log(batches);
        batches =safeJSON(batches);
        // console.log(batches);
        res.json({ success: true, batches });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/add-candidates", async (req, res) => {
    try {
        const { batchId, candidateName, ownerAddress } = req.body;

        if (!batchId || !candidateName || !ownerAddress) {
            return res.status(400).json({ success: false, error: "Missing batchId, candidateName, or ownerAddress" });
        }

        console.log("Adding candidate:", { batchId, candidateName, ownerAddress });

        // Step 1: Check if voting has started for the batch
        const isVotingActive = await contract.methods.getVotingStatus(batchId).call();
        if (isVotingActive) {
            return res.status(400).json({ success: false, error: "Cannot add candidate after voting has started." });
        }

        // Step 2: Prepare and send transaction
        const tx = await contract.methods.addCandidate(batchId, candidateName).send({
            from: ownerAddress,
            gas: 2000000,
        });

        res.json({ success: true, message: "Candidate added successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error("Error adding candidate:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.get("/", async (req, res) => {
    try {
        const owner = await contract.methods.getOwner().call();
        console.log("Contract Owner Address:", owner);
        res.json({ owner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
