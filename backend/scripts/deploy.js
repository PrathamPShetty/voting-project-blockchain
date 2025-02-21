const hre = require("hardhat");

async function main() {
    console.log("Deploying Voting contract...");

    const candidates = ["Alice", "Bob", "Charlie"];
    const duration = 10; // Voting duration in minutes

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(candidates, duration);

    await voting.deployed();
    console.log(`Voting contract deployed at: ${voting.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
