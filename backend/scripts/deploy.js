const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying Voting contract...");

    // Deploy contract
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    
    console.log(`✅ Voting contract deployed at: ${voting.address}`);

    // ❌ Do not create a batch (Keep it null)
}

main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
