module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,       // Port used by Ganache
      network_id: "*",
      gas: 10000000,
      gasPrice: 2000000000 // 2 Gwei in wei
    }
  },
  compilers: {
    solc: {
      version: "0.6.0",  // Specify Solidity version 0.6.0
    }
  }
};
