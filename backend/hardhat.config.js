require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7546", // Ganache RPC URL
      accounts: ["0x94cdd68182af2930d1d302a9770e637aab2b1c9c80e631dfe187057089896111"], // Private key from .env
    },
   
  },
};
