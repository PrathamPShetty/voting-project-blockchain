import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./index.css";

const AdminPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const location = useLocation();
  const account = location.state?.account;

  useEffect(() => {
    if (account) {
      setSenderAddress(account);
    }
  }, [account]);

  // Fetch batches from the backend
  const getBatches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getbatches");
      setBatches(response.data?.batches || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    getBatches();
  }, []);

  // Add a new batch
  const addBatch = async () => {
    if (!newBatchName.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/create-batch", {
        batchName: newBatchName,
        senderAddress,
      });

      if (response.data.success) {
        getBatches();
        setNewBatchName("");
        setShowBatchForm(false);
      } else {
        alert("Batch creation failed!");
      }
    } catch (error) {
      console.error("Batch creation error:", error);
      alert("Failed to create batch. Try again.");
    }
  };

  // Add a candidate
  const addCandidate = async () => {
    if (!newCandidateName.trim() || !selectedBatch) return;

    try {
      const response = await axios.post("http://localhost:5000/add-candidates", {
        candidateName: newCandidateName,
        batchId: selectedBatch,
        ownerAddress: senderAddress,
      });

      if (response.data.success) {
        getBatches();
        setNewCandidateName("");
        setShowForm(false);
      } else {
        alert("Candidate addition failed!");
      }
    } catch (error) {
      console.error("Candidate addition error:", error);
      alert("Failed to add candidate. Try again.");
    }
  };

  // Start voting
  const startVoting = async (batchId) => {
    try {
      const response = await axios.post("http://localhost:5000/start-voting", {
        batchId,
        senderAddress,
      });

      if (response.data.success) {
        alert("Voting started successfully!");
        getBatches();
      } else {
        alert("Failed to start voting.");
      }
    } catch (error) {
      console.error("Start voting error:", error);
      alert("Error starting voting.");
    }
  };

  // Stop voting
  const stopVoting = async (batchId) => {
    try {
      const response = await axios.post("http://localhost:5000/stop-voting", {
        batchId,
       senderAddress,
      });

      if (response.data.success) {
        alert("Voting stopped successfully!");
        getBatches();
      } else {
        alert("Failed to stop voting.");
      }
    } catch (error) {
      console.error("Stop voting error:", error);
      alert("Error stopping voting.");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <button onClick={() => setShowBatchForm(!showBatchForm)} className="btn">
        {showBatchForm ? "Hide Batch Form" : "Add Batch"}
      </button>

      {showBatchForm && (
        <div className="form">
          <input
            type="text"
            placeholder="Enter batch name"
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
          />
          <button onClick={addBatch} disabled={!newBatchName.trim()}>
            Add Batch
          </button>
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)} className="btn">
        {showForm ? "Hide Form" : "Add Candidate"}
      </button>

      {showForm && (
        <div className="form">
          <select onChange={(e) => setSelectedBatch(e.target.value)} value={selectedBatch}>
            <option value="">Select Batch</option>
            {batches.map((batch, index) => (
              <option key={index} value={batch.name}>
                {batch.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter candidate name"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
          />
          <button onClick={addCandidate} disabled={!selectedBatch || !newCandidateName.trim()}>
            Add Candidate
          </button>
        </div>
      )}

      <div className="batches-list">
        <h2>Batches & Candidates</h2>
        {batches.length > 0 ? (
          batches.map((batch, batchIndex) => (
            <div key={batchIndex} className="batch">
              <h3>{batch.name}</h3>

              <button onClick={() => startVoting(batch.name)} className="start-btn">
                Start Voting
              </button>
              <button onClick={() => stopVoting(batch.name)} className="stop-btn">
                Stop Voting
              </button>

              {batch.candidates.length === 0 ? (
                <p>No candidates yet</p>
              ) : (
                batch.candidates.map((candidate, index) => (
                  <div key={index} className="candidate-item">
                    <span>{candidate.name}</span>
                    <span>Votes: {candidate.voteCount}</span>
                  </div>
                ))
              )}
            </div>
          ))
        ) : (
          <p>No batches available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
