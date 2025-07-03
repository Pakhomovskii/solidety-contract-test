## Solidity Contract Analysis

This project aims to analyze and compare gas consumption and transaction times of various Solidity contracts under different scenarios. The results are summarized in the charts provided below.
See publication here https://zenodo.org/records/14911139
## Overview
The project evaluates several Solidity contracts, including:
- `Vulnerable`
- `SecureCEI`
- `AdvancedCEI`
- `SecureMutex`
- `SecurePullPayment`
- `SecureOZReentrancyGuard`

The tests analyze three main aspects:
1. Gas consumption during **deployment**.
2. Gas consumption during **deposit**.
3. Gas consumption during **withdrawal**.
4. Correlation between gas consumption and transaction time.

## Project Configuration

The project uses the following Truffle configuration:

```javascript
module.exports = {
  networks: {   
    development: { 
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 10000000,
      gasPrice: 2000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",    
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
```

## How to Run


1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile the contracts:
   ```bash
   truffle compile
   ```

3. Deploy the contracts:
   ```bash
   truffle migrate
   ```

4. Run ganache-cli and  the tests:
   ```bash
   ganache-cli --gasLimit 10000000 --defaultBalanceEther 2000 --gasPrice 2000000000
   ```
   and
   ```bash
   truffle test
   ```
