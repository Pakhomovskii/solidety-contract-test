const Vulnerable = artifacts.require("Vulnerable");
const SecureCEI = artifacts.require("SecureCEI");
const SecureMutex = artifacts.require("SecureMutex");
const SecurePullPayment = artifacts.require("SecurePullPayment");
const SecureOZReentrancyGuard = artifacts.require("SecureOZReentrancyGuard");
const AdvancedCEI = artifacts.require("AdvancedCEI");

contract("Smart Contract Tests", (accounts) => {
  const [deployerAccount, userAccount] = accounts;
  const numRuns = 5; // Number of runs to average gas consumption

  // Generic function to test contracts with standard deposit and withdraw
  async function testStandardContract(contractArtifact, contractName, withdrawalAmount) {
    let totalGasUsedDeploy = 0;
    let totalGasUsedDeposit = 0;
    let totalGasUsedWithdraw = 0;
    let finalContractBalance;
    let finalUserBalance;

    for (let i = 0; i < numRuns; i++) {
      const contractInstance = await contractArtifact.new({
        from: deployerAccount,
        value: web3.utils.toWei("10", "ether"),
      });

      // Record deployment gas usage
      const deployTx = await web3.eth.getTransactionReceipt(contractInstance.transactionHash);
      totalGasUsedDeploy += deployTx.gasUsed;

      // Perform deposit
      const depositTx = await contractInstance.deposit({
        from: userAccount,
        value: web3.utils.toWei("1", "ether"),
      });
      totalGasUsedDeposit += depositTx.receipt.gasUsed;

      // Perform withdrawal
      const withdrawTx = await contractInstance.withdraw(web3.utils.toWei(withdrawalAmount, "ether"), {
        from: userAccount,
      });
      totalGasUsedWithdraw += withdrawTx.receipt.gasUsed;

      // Check final balances
      const contractBalance = await web3.eth.getBalance(contractInstance.address);
      const userBalance = await contractInstance.balances(userAccount);

      if (i === numRuns - 1) {
        finalContractBalance = web3.utils.fromWei(contractBalance, "ether");
        finalUserBalance = web3.utils.fromWei(userBalance, "ether");
      }
    }

    console.log(`\n=== ${contractName} ===`);
    console.log(`Average gas used for deployment: ${totalGasUsedDeploy / numRuns}`);
    console.log(`Average gas used for deposit: ${totalGasUsedDeposit / numRuns}`);
    console.log(`Average gas used for withdrawal: ${totalGasUsedWithdraw / numRuns}`);
    console.log(`Final contract balance: ${finalContractBalance} ETH`);
    console.log(`Final user balance in contract: ${finalUserBalance} ETH`);
  }

  // Test for contracts with custom withdrawal logic
  async function testCustomContract(contractArtifact, contractName) {
    let totalGasUsedDeploy = 0;
    let totalGasUsedDeposit = 0;
    let totalGasUsedWithdraw = 0;
    let finalContractBalance;
    let finalUserBalance;

    for (let i = 0; i < numRuns; i++) {
      const contractInstance = await contractArtifact.new({
        from: deployerAccount,
        value: web3.utils.toWei("10", "ether"),
      });

      // Record deployment gas usage
      const deployTx = await web3.eth.getTransactionReceipt(contractInstance.transactionHash);
      totalGasUsedDeploy += deployTx.gasUsed;

      // Perform deposit
      const depositTx = await contractInstance.deposit({
        from: userAccount,
        value: web3.utils.toWei("1", "ether"),
      });
      totalGasUsedDeposit += depositTx.receipt.gasUsed;

      // Perform custom withdrawal (no arguments)
      const withdrawTx = await contractInstance.withdraw({ from: userAccount });
      totalGasUsedWithdraw += withdrawTx.receipt.gasUsed;

      // Check final balances
      const contractBalance = await web3.eth.getBalance(contractInstance.address);
      const userBalance = await contractInstance.balances(userAccount);

      if (i === numRuns - 1) {
        finalContractBalance = web3.utils.fromWei(contractBalance, "ether");
        finalUserBalance = web3.utils.fromWei(userBalance, "ether");
      }
    }

    console.log(`\n=== ${contractName} ===`);
    console.log(`Average gas used for deployment: ${totalGasUsedDeploy / numRuns}`);
    console.log(`Average gas used for deposit: ${totalGasUsedDeposit / numRuns}`);
    console.log(`Average gas used for withdrawal: ${totalGasUsedWithdraw / numRuns}`);
    console.log(`Final contract balance: ${finalContractBalance} ETH`);
    console.log(`Final user balance in contract: ${finalUserBalance} ETH`);
  }

  it("test Vulnerable contract", async () => {
    await testStandardContract(Vulnerable, "Vulnerable", "0.5");
  });

  it("test SecureCEI contract", async () => {
    await testStandardContract(SecureCEI, "SecureCEI", "0.5");
  });

  it("test AdvancedCEI contract", async () => {
    await testStandardContract(AdvancedCEI, "AdvancedCEI", "0.5");
  });

  it("test SecureMutex contract", async () => {
    await testStandardContract(SecureMutex, "SecureMutex", "0.5");
  });

  it("test SecurePullPayment contract", async () => {
    await testCustomContract(SecurePullPayment, "SecurePullPayment");
  });

  it("test SecureOZReentrancyGuard contract", async () => {
    await testStandardContract(SecureOZReentrancyGuard, "SecureOZReentrancyGuard", "0.5");
  });

});
