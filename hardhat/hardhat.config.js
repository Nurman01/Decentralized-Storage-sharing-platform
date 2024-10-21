require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.0",  // Match this with your contract version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "london"  // Use an appropriate EVM version like 'london', 'istanbul', etc.
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  }
};

