// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct VotingBatch {
        string name;
        Candidate[] candidates;
        uint256 votingStart;
        uint256 votingEnd;
        uint256 resultDate;
        mapping(address => bool) voters;
        bool exists;
        bool hasStarted;
    }

    struct BatchResponse {
        string name;
        Candidate[] candidates;
    }

    address public owner;
    uint256 public batchCount;
    mapping(uint256 => VotingBatch) public batches;
    mapping(string => uint256) public batchIds;

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
        require(batchIds[_batchName] == 0, "Batch name already exists.");
        batchCount++;

        VotingBatch storage batch = batches[batchCount];
        batch.name = _batchName;
        batch.exists = true;

        batchIds[_batchName] = batchCount;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            batch.candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
        }
    }

    function addCandidate(string memory _batchName, string memory _candidateName) public onlyOwner {
        uint256 batchId = batchIds[_batchName];
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

        batch.votingEnd = block.timestamp;
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

    function getVotingResults(string memory _batchName) public view returns (Candidate[] memory) {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        VotingBatch storage batch = batches[batchId];

        require(block.timestamp >= batch.resultDate, "Results are not available yet.");

        return batch.candidates;
    }

    function getActiveBatches() public view returns (string[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= batchCount; i++) {
            if (batches[i].hasStarted && block.timestamp < batches[i].votingEnd) {
                activeCount++;
            }
        }

        string[] memory activeBatches = new string[](activeCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= batchCount; i++) {
            if (batches[i].hasStarted && block.timestamp < batches[i].votingEnd) {
                activeBatches[index] = batches[i].name;
                index++;
            }
        }

        return activeBatches;
    }

    function getAllBatches() public view returns (BatchResponse[] memory) {
        BatchResponse[] memory batchResponses = new BatchResponse[](batchCount);

        for (uint256 i = 1; i <= batchCount; i++) {
            batchResponses[i - 1] = BatchResponse({
                name: batches[i].name,
                candidates: batches[i].candidates
            });
        }

        return batchResponses;
    }

    function getResultDate(string memory _batchName) public view returns (uint256) {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");
        return batches[batchId].resultDate;
    }

    function setResultDate(string memory _batchName, uint256 _resultDate) public onlyOwner {
        uint256 batchId = batchIds[_batchName];
        require(batchId > 0, "Batch does not exist.");

        batches[batchId].resultDate = _resultDate;
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
