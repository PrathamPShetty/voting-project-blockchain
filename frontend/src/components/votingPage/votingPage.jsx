import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./styles.css";  // Import CSS

const VotingApp = () => {
    const [wallet, setWallet] = useState("");
    const [batch, setBatch] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const location = useLocation();
    const account = location.state?.account;
    const batchName = location.state?.batch;

    useEffect(() => {
        if (account) {
            setWallet(account);
        }
        if (batchName) {
            setBatch(batchName);
        }

        console.log(batchName);
    }, [account,batchName]);



    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://localhost:5000/candidates", {
                    params: { batch } 
                });
                setCandidates(response.data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };
    
        fetchCandidates();
    }, [batch]); // ✅ Add batchName as a dependency to refetch when it changes
    

    const vote = async () => {
        if (selectedCandidate === null) {
            alert("Please select a candidate!");
            return;
        }

        console.log(selectedCandidate);

        try {
            const response = await axios.post("http://localhost:5000/vote", {
                address: wallet,
                batch:batch,
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
            {/* Header Section */}
            <div className="header">
                <h1>Voting DApp</h1>
                {wallet && <p className="wallet">Connected: {wallet}</p>}
            </div>

            {/* Voting Section */}
            <div className="voting-section">
                <h2>Candidates</h2>
                {candidates.length === 0 ? (
                    <p>Loading candidates...</p>
                ) : (
                    <ul className="candidate-list">
                        {candidates.map((candidate, index) => (
                            <li 
                                key={index} 
                                className={`candidate-item ${selectedCandidate === index ? "selected" : ""}`} 
                                onClick={() => setSelectedCandidate(index)}
                            >
                                <label>
                                    <input 
                                        type="radio" 
                                        name="candidate" 
                                        checked={selectedCandidate === index} 
                                        onChange={() => setSelectedCandidate(index)} 
                                    />
                                    {candidate.name} 
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                <button 
                    className="vote-button" 
                    onClick={vote} 
                    disabled={!wallet || selectedCandidate === null}
                >
                    Vote
                </button>
            </div>

            {/* Candidate ID Display */}
            <div className="candidate-id">
                {selectedCandidate !== null && (
                    <h3>Selected Candidate ID: {selectedCandidate}</h3>
                )}
            </div>
        </div>
    );
};

export default VotingApp;
