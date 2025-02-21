import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./styles.css";  // Import CSS

const VotingApp = () => {
    const [wallet, setWallet] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const location = useLocation();
    const account = location.state?.account;
    useEffect(()=>{
        if(account){
            setWallet(account);
        }
    },[account]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://localhost:5000/candidates");
                setCandidates(response.data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };
        fetchCandidates();
    }, []);

    const vote = async () => {
        if (selectedCandidate === null) {
            alert("Please select a candidate!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/vote", {
                address: wallet,
                candidateIndex: selectedCandidate
            });

            alert(response.data.message);
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    return (
        <div className="container">
            <h1>Voting DApp</h1>

            {wallet ? (
                <p className="connected-wallet">Connected: {wallet}</p>
            ) : (
                <button className="connect-button">Login failed</button>
            )}

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
                            <span>{candidate.name} ({candidate.voteCount} votes)</span>
                            <input 
                                type="radio" 
                                name="candidate" 
                                checked={selectedCandidate === index} 
                                onChange={() => setSelectedCandidate(index)} 
                            />
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
    );
};

export default VotingApp;
