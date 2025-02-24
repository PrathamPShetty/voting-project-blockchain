// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct VotingBatch {
        string name; // Store batch name
        Candidate[] candidates;
        uint256 votingStart;
        uint256 votingEnd;
        mapping(address => bool) voters;
        bool exists;
        bool hasStarted;
    }

    address public owner;
    uint256 public batchCount; // Track number of batches
    mapping(uint256 => VotingBatch) public batches; // Map batch ID to VotingBatch
    mapping(string => uint256) public batchIds; // Map batch name to batch ID

    constructor() {
        owner = msg.sender;
        batchCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    function createBatch(
        string memory _batchName,
        string[] memory _candidateNames
    ) public onlyOwner {
        require(batchIds[_batchName] == 0, "Batch name already exists."); // Prevent duplicate names
        batchCount++; // Increment batch count

        VotingBatch storage batch = batches[batchCount];
        batch.name = _batchName;
        batch.votingStart = 0; // Initially, voting is not started
        batch.votingEnd = 0;
        batch.exists = true;
        batch.hasStarted = false;

        batchIds[_batchName] = batchCount; // Store batch name mapping

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            batch.candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
        }
    }

    function addCandidate(string memory _batchName, string memory _candidateName) public onlyOwner {
        uint256 batchId = batchIds[_batchName]; // Get batch ID
        require(batchId > 0 && batchId <= batchCount, "Batch does not exist.");
        
        VotingBatch storage batch = batches[batchId];
        require(!batch.hasStarted, "Cannot add candidate after voting has started.");

        batch.candidates.push(Candidate({name: _candidateName, voteCount: 0}));
    }

    function startVoting(string memory _batchName, uint256 _durationInMinutes) public onlyOwner {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        VotingBatch storage batch = batches[batchId];

        require(!batch.hasStarted, "Voting already started.");

        batch.votingStart = block.timestamp;
        batch.votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        batch.hasStarted = true;
    }

    function stopVoting(string memory _batchName) public onlyOwner {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        VotingBatch storage batch = batches[batchId];

        require(batch.hasStarted, "Voting has not started yet.");

        batch.votingEnd = block.timestamp; // Stop voting immediately
    }

function getAllCandidates(string memory _batchName) 
    public view returns (string memory, bool, bool) 
{
    uint256 batchId = batchIds[_batchName];
    require(batchId > 0, "Batch does not exist.");
    
    VotingBatch storage batch = batches[batchId];

    string memory candidateList = "";
    
    for (uint256 i = 0; i < batch.candidates.length; i++) {
        candidateList = string(abi.encodePacked(candidateList, batch.candidates[i].name, ", "));
    }

    // Check if the caller has already voted in this batch
    bool hasVoted = batch.voters[msg.sender];

    // Check if the batch has started
    bool hasStarted = batch.hasStarted;

    return (candidateList, hasVoted, hasStarted);
}

    function vote(string memory _batchName, uint256 candidateIndex) public {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        VotingBatch storage batch = batches[batchId];

        require(!batch.voters[msg.sender], "You have already voted.");
        require(candidateIndex < batch.candidates.length, "Invalid candidate index.");
        require(block.timestamp >= batch.votingStart && block.timestamp < batch.votingEnd, "Voting is not active.");

        batch.candidates[candidateIndex].voteCount++;
        batch.voters[msg.sender] = true;
    }

    function getCandidates(string memory _batchName) public view returns (Candidate[] memory) {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        return batches[batchId].candidates;
    }

    function getVotingStatus(string memory _batchName) public view returns (bool) {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        VotingBatch storage batch = batches[batchId];
        return (block.timestamp >= batch.votingStart && block.timestamp < batch.votingEnd);
    }

    function getRemainingTime(string memory _batchName) public view returns (uint256) {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        VotingBatch storage batch = batches[batchId];

        if (block.timestamp >= batch.votingEnd) {
            return 0;
        }
        return batch.votingEnd - block.timestamp;
    }

    function getBatchId(string memory _batchName) public view returns (uint256) {
        return batchIds[_batchName];
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getBatch(uint256 _batchId) public view returns (string memory, Candidate[] memory) {
        require(_batchId > 0 && _batchId <= batchCount, "Batch does not exist");
        return (batches[_batchId].name, batches[_batchId].candidates);
    }

    function getTotalBatches() public view returns (uint256) {
        return batchCount;
    }


}
