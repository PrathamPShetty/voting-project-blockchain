import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./styles.css"; // Import CSS

const VotingApp = () => {
    const [wallet, setWallet] = useState("");
    const [batch, setBatch] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [shuffledCandidates, setShuffledCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const location = useLocation();
    const account = location.state?.account;
    const batchName = location.state?.batch;

    useEffect(() => {
        if (account) setWallet(account);
        if (batchName) setBatch(batchName);
        console.log(batchName);
    }, [account, batchName]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://localhost:5000/candidates", {
                    params: { batch }
                });

                // Store the original index with the candidate
                const candidatesWithIndex = response.data.map((candidate, index) => ({
                    ...candidate,
                    originalIndex: index
                }));

                // Shuffle candidates but keep the original index reference
                setShuffledCandidates(shuffleArray(candidatesWithIndex));
                setCandidates(candidatesWithIndex);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };

        if (batch) fetchCandidates();
    }, [batch]);

    // Function to shuffle the array
    const shuffleArray = (array) => {
        return array
            .map(a => ({ ...a, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(a => {
                delete a.sort;
                return a;
            });
    };

    const vote = async () => {
        if (selectedCandidate === null) {
            alert("Please select a candidate!");
            return;
        }

        console.log("Voting for candidate with original index:", selectedCandidate);

        try {
            const response = await axios.post("http://localhost:5000/vote", {
                address: wallet,
                batch: batch,
                candidateIndex: selectedCandidate
            });

            alert(response.data.message);
        } catch (error) {
            alert("Already Voted");
            console.error("Error voting:", error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Voting DApp</h1>
                {wallet && <p className="wallet">Connected: {wallet}</p>}
            </div>

            <div className="voting-section">
                <h2>Candidates</h2>
                {shuffledCandidates.length === 0 ? (
                    <p>Loading candidates...</p>
                ) : (
                    <ul className="candidate-list">
                        {shuffledCandidates.map((candidate) => (
                            <li
                                key={candidate.originalIndex}
                                className={`candidate-item ${selectedCandidate === candidate.originalIndex ? "selected" : ""}`}
                                onClick={() => setSelectedCandidate(candidate.originalIndex)}
                            >
                                <label>
                                    <input
                                        type="radio"
                                        name="candidate"
                                        checked={selectedCandidate === candidate.originalIndex}
                                        onChange={() => setSelectedCandidate(candidate.originalIndex)}
                                    />
                                    {candidate.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                <button className="vote-button" onClick={vote} disabled={!wallet || selectedCandidate === null}>
                    Vote
                </button>
            </div>

            <div className="candidate-id">
                {selectedCandidate !== null && <h3>Selected Candidate ID: {selectedCandidate}</h3>}
            </div>
        </div>
    );
};

export default VotingApp;
