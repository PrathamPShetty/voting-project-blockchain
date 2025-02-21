import { useState } from "react";
import './index.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidates, setCandidates] = useState([]);

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (candidateName && candidateParty) {
      setCandidates([...candidates, { name: candidateName, party: candidateParty }]);
      setCandidateName("");
      setCandidateParty("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button
          className={`w-full py-3 text-left px-4 ${activeTab === "dashboard" ? "bg-gray-700" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`w-full py-3 text-left px-4 ${activeTab === "candidates" ? "bg-gray-700" : ""}`}
          onClick={() => setActiveTab("candidates")}
        >
          Manage Candidates
        </button>
        <button
          className={`w-full py-3 text-left px-4 ${activeTab === "votes" ? "bg-gray-700" : ""}`}
          onClick={() => setActiveTab("votes")}
        >
          View Votes
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel - {activeTab}</h1>
        
        {activeTab === "dashboard" && <p>Welcome to the dashboard.</p>}
        
        {activeTab === "candidates" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Add Candidate</h2>
            <form onSubmit={handleAddCandidate} className="mb-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                required
              />
              <input
                type="text"
                placeholder="Party Name"
                value={candidateParty}
                onChange={(e) => setCandidateParty(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Candidate
              </button>
            </form>

            {/* Candidate List */}
            <h2 className="text-xl font-semibold mt-4">Candidate List</h2>
            <ul className="list-disc pl-5">
              {candidates.map((candidate, index) => (
                <li key={index} className="mt-2">
                  {candidate.name} - {candidate.party}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "votes" && <p>View Votes Section</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
