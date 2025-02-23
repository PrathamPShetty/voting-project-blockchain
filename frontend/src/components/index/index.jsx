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
      const response = await fetch("http://localhost:5000/getbatches");
      const data = await response.json();
      setBatches(data?.batches || []); // Ensures state is never undefined
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // Fetch batches on mount
  useEffect(() => {
    getBatches();
  }, []);

  // Add a new batch
  const addBatch = async () => {
    if (!newBatchName.trim()) return; // Prevent empty input

    try {
      const response = await axios.post("http://localhost:5000/create-batch", {
        batchName: newBatchName,
        senderAddress,
      });

      if (response.data.success) {
        getBatches(); // Refresh batch list
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

  // Add a candidate to a batch
  const addCandidate = async () => {
    if (!newCandidateName.trim() || !selectedBatch) return;

    try {
      const response = await axios.post("http://localhost:5000/candidates", {
        candidateName: newCandidateName,
        batchName: selectedBatch,
        senderAddress,
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

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* Add Batch */}
      <button onClick={() => setShowBatchForm(!showBatchForm)} className="add-candidate-btn">
        {showBatchForm ? "Hide Batch Form" : "Add Batch"}
      </button>

      {showBatchForm && (
        <div className="candidate-form">
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

      {/* Add Candidate */}
      <button onClick={() => setShowForm(!showForm)} className="add-candidate-btn">
        {showForm ? "Hide Form" : "Add Candidate"}
      </button>

      {showForm && (
        <div className="candidate-form">
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

      {/* Display Batches & Candidates */}
      <div className="batches-list">
        <h2>Batches & Candidates</h2>
        {batches.length > 0 ? (
          batches.map((batch, batchIndex) => (
            <div key={batchIndex} className="batch">
              <h3>{batch.name}</h3>
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
