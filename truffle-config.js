module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Локальный хост
      port: 8545,            // Порт Ganache
      network_id: "*",       // Любой network id
      gas: 10000000,
      gasPrice: 2000000000,  // 2 Gwei в wei
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",      // Укажите точную версию компилятора
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
        evmVersion: "istanbul",
      },
    },
  },
};
