import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,useNavigate} from "react-router-dom";
import "./index.css";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const AdminPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [resultDate, setResultDate] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);

  
  const [showDialog, setShowDialog] = useState(false); // For pop-up
  const [batchResults, setBatchResults] = useState([]); // Store results
  const [selectedBatchName, setSelectedBatchName] = useState(""); // Selected batch for results
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state?.account;

  useEffect(() => {
    if (account) {
      setSenderAddress(account);
    }
    getBatches();
  }, [account]);

  // Fetch batches from the backend
  const getBatches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getallbatches");
      const batchesArray = Object.values(response.data?.batches || []);
    
      console.log("Converted Batches:", batchesArray);
  
      setBatches(batchesArray);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

 
  const viewResult = async (batchId) => {
    try {
      const response = await axios.get("http://localhost:5000/getresult", {
        params: { batchName: batchId },
      });

      console.log(response);

      const batchesArray = Object.values(response.data?.candidates || []);

      setBatchResults(batchesArray);
      setSelectedBatchName(batchId);
      setShowDialog(true); // Open dialog
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    if (account) {
      setSenderAddress(account);
    }
    getBatches();
  }, [account]);
  
  const addBatchandres = async () => {
    const batchId = await addBatch();
    console.log(batchId);
    if (batchId) {
      await setBatchResultDate(batchId);
    }
  };
  

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
        
        // Return batchId for setting the result date
        return response.data.batchId; 
      } else {
        showAlert("Batch creation failed!","error");
      }
    } catch (error) {
      console.error("Batch creation error:", error);
      showAlert("Failed to create batch. Try again.","error");
    }
  };
  
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setOpenAlert(true);
  };

  // Set result date for a batch
  const setBatchResultDate = async (batchId) => {
    if (!resultDate.trim()) {
      showAlert("Please select a valid date.","error");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/set-result-date", {
        batchId, 
        resultDate,
        senderAddress,
      });
  
      if (response.data.success) {
        showAlert("Result date set successfully!","success");
        getBatches();
      } else {
        showAlert("Failed to set result date.","error");
      }
    } catch (error) {
      console.error("Error setting result date:", error);
      showAlert("Error setting result date.","error");
    }
  };
  

  // Add a candidate
  const addCandidate = async () => {
    if (!newCandidateName.trim() || !selectedBatch) return;

    console.log(newCandidateName);

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
        showAlert("Candidate addition failed!", "error");
      }
    } catch (error) {
      console.error("Candidate addition error:", error);
      showAlert("Failed to add candidate. Try again.","error");
    }
  };

  // Start voting
  const startVoting = async (batchId) => {
    try {
      console.log(batchId);
      console.log(senderAddress);
      const response = await axios.post("http://localhost:5000/start-voting", {
        batchId,
        senderAddress,
      });

      if (response.data.success) {
        showAlert("Voting started successfully!","success");
        getBatches();
      } else {
        showAlert("Failed to start voting.","error");
      }
    } catch (error) {
      console.error("Start voting error:", error);
      showAlert("Error starting voting.","error");
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
        showAlert("Voting stopped successfully!","success");
        getBatches();
      } else {
        showAlert("Failed to stop voting.","error");
      }
    } catch (error) {
      console.error("Stop voting error:", error);
      showAlert("Error stopping voting.","error");
    }
  };

  return (<>
  

      <div  >
          <Snackbar
            open={openAlert}
            autoHideDuration={4000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setOpenAlert(false)} severity={alertType} variant="filled">
              {alertMessage}
            </Alert>
          </Snackbar>
          </div>
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* Add Batch Section */}
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
            required
          />
          <input
            type="date"
            placeholder="Enter Result Date"
            value={resultDate}
            onChange={(e) => setResultDate(e.target.value)}
            required
          />
          <button onClick={addBatchandres} disabled={!newBatchName.trim()}>
            Add Batch
          </button>
        </div>
      )}

      {/* Add Candidate Section */}
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

      {/* Batches List */}
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
              <button onClick={() => viewResult(batch.name)} className="start-btn">
                View Result 
              </button>

              {batch.candidates.length === 0 ? (
                <p>No candidates yet</p>
              ) : (
                batch.candidates.map((candidate, index) => (
                  
                  <div key={index} className="candidate-item">
                    <span>{candidate.name}</span>
                  </div>
                ))
              )}
            </div>
          ))
        ) : (
          <p>No batches available.</p>
        )}
      </div>
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h2>Results for {selectedBatchName}</h2>
            {batchResults.length > 0 ? (
              batchResults.map((result, idx) => (
                <p key={idx}>{result.name}: {result.voteCount} votes</p>
              ))
            ) : (
              <p>No results available.</p>
            )}
            <button className="start-btn" onClick={() => setShowDialog(false)}>Close</button>
          </div>
        </div>
      )}


<button className="speak-button" onClick={() => navigate("/")}>
  Back
</button>

    </div>

      </>
  );
};

export default AdminPanel;
