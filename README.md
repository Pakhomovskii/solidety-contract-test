# Solidity Contract Analysis

This project aims to analyze and compare gas consumption and transaction times of various Solidity contracts under different scenarios. The results are summarized in the charts provided below.

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

## Results

### 1. Average Gas Consumption During Deployment
![Gas Consumption Deployment](file-LQ6ayNp6ThmUo3Bcjge4BP)

### 2. Average Gas Consumption During Withdrawal
![Gas Consumption Withdrawal](file-Hox5ge42D98taBQmWqkSKk)

### 3. Average Gas Consumption During Deposit
![Gas Consumption Deposit](file-5uEw6Z1ZecQzpep6hiQRnn)

### 4. Comparison of Transaction Times for Deployment, Deposit, and Withdrawal
![Transaction Times Comparison](file-Xw8LVreK3qaQeqZSmXGq81)

### 5. Correlation Between Gas Consumption and Transaction Times (Deployment)
![Correlation Deployment](file-KUrvMYTZpUkmgTkuhpGhVU)

### 6. Correlation Between Gas Consumption and Transaction Times (Deposit)
![Correlation Deposit](file-DhqddbjCfq3oEz1m3xd9Vi)

### 7. Correlation Between Gas Consumption and Transaction Times (Withdrawal)
![Correlation Withdrawal](file-K1GxT1o6KsUHCGa8U1eVyM)

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

1. Clone the repository:
   ```bash
   git clone https://github.com/Pakhomovskii/solidety-contract-test.git
   cd solidety-contract-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the contracts:
   ```bash
   truffle compile
   ```

4. Deploy the contracts:
   ```bash
   truffle migrate
   ```

5. Run the tests:
   ```bash
   truffle test
   ```

## Conclusion
The results provide insights into the efficiency of various smart contract security mechanisms. Use the visualizations to identify optimal trade-offs between gas costs and transaction times.

---

For more details, please refer to the [GitHub Repository](https://github.com/Pakhomovskii/solidety-contract-test).
