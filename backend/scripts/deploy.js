const hre = require("hardhat");

async function main() {
    const candidateNames = ["Alice", "Bob", "Charlie"];
    const duration = 10; // Voting duration in minutes

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(candidateNames, duration);

    await voting.deployed();
    console.log(`Voting contract deployed to: ${voting.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
