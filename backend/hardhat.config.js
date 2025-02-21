require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    volta: {
      url: "https://volta-rpc.energyweb.org",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
