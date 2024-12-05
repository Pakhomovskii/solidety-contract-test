const Vulnerable = artifacts.require("Vulnerable");
const SecureCEI = artifacts.require("SecureCEI");
const SecureMutex = artifacts.require("SecureMutex");
const SecurePullPayment = artifacts.require("SecurePullPayment");
const SecureOZReentrancyGuard = artifacts.require("SecureOZReentrancyGuard");

contract("Smart Contract Tests", (accounts) => {
  const [deployerAccount, userAccount] = accounts;
  const numRuns = 5; // Number of runs to average gas consumption

  async function testContract(contractArtifact, contractName) {
    let totalGasUsedDeploy = 0;
    let totalGasUsedDeposit = 0;
    let totalGasUsedWithdraw = 0;
    let finalContractBalance;
    let finalUserBalance;

    for (let i = 0; i < numRuns; i++) {
      // Deploying the contract with 10 ETH
      const contractInstance = await contractArtifact.new({
        from: deployerAccount,
        value: web3.utils.toWei("10", "ether"),
      });
      const deployTx = await web3.eth.getTransactionReceipt(contractInstance.transactionHash);
      totalGasUsedDeploy += deployTx.gasUsed;

      // User deposits 1 ETH
      const depositTx = await contractInstance.deposit({
        from: userAccount,
        value: web3.utils.toWei("1", "ether"),
      });
      totalGasUsedDeposit += depositTx.receipt.gasUsed;

      // Record contract and user balance after deposit
      const contractBalanceAfterDeposit = await web3.eth.getBalance(contractInstance.address);
      const userBalanceAfterDeposit = await contractInstance.balances(userAccount);

      // User withdraws 0.5 ETH
      const withdrawTx = await contractInstance.withdraw(web3.utils.toWei("0.5", "ether"), {
        from: userAccount,
      });
      totalGasUsedWithdraw += withdrawTx.receipt.gasUsed;

      // Record contract and user balance after withdrawal
      const contractBalanceAfterWithdraw = await web3.eth.getBalance(contractInstance.address);
      const userBalanceAfterWithdraw = await contractInstance.balances(userAccount);

      // Check balances
      assert.equal(
        web3.utils.fromWei(userBalanceAfterWithdraw, "ether"),
        "0.5",
        "User balance should be 0.5 ETH"
      );

      if (i === numRuns - 1) {
        finalContractBalance = web3.utils.fromWei(contractBalanceAfterWithdraw, "ether");
        finalUserBalance = web3.utils.fromWei(userBalanceAfterWithdraw, "ether");
      }
    }

    const averageGasUsedDeploy = totalGasUsedDeploy / numRuns;
    const averageGasUsedDeposit = totalGasUsedDeposit / numRuns;
    const averageGasUsedWithdraw = totalGasUsedWithdraw / numRuns;

    console.log(`\n=== ${contractName} ===`);
    console.log(`Average gas used for deployment: ${averageGasUsedDeploy}`);
    console.log(`Average gas used for deposit: ${averageGasUsedDeposit}`);
    console.log(`Average gas used for withdrawal: ${averageGasUsedWithdraw}`);
    console.log(`Final contract balance: ${finalContractBalance} ETH`);
    console.log(`Final user balance in contract: ${finalUserBalance} ETH`);
  }

  it("should test Vulnerable contract", async () => {
    await testContract(Vulnerable, "Vulnerable");
  });

  it("should test SecureCEI contract", async () => {
    await testContract(SecureCEI, "SecureCEI");
  });

  it("should test SecureMutex contract", async () => {
    await testContract(SecureMutex, "SecureMutex");
  });

  it("should test SecurePullPayment contract", async () => {
    // For the SecurePullPayment contract, modify the test function as the withdraw() method takes no arguments
    async function testPullPaymentContract(contractArtifact, contractName) {
      let totalGasUsedDeploy = 0;
      let totalGasUsedDeposit = 0;
      let totalGasUsedWithdraw = 0;
      let finalContractBalance;
      let finalUserBalance;

      for (let i = 0; i < numRuns; i++) {
        // Deploying the contract with 10 ETH
        const contractInstance = await contractArtifact.new({
          from: deployerAccount,
          value: web3.utils.toWei("10", "ether"),
        });
        const deployTx = await web3.eth.getTransactionReceipt(contractInstance.transactionHash);
        totalGasUsedDeploy += deployTx.gasUsed;

        // User deposits 1 ETH
        const depositTx = await contractInstance.deposit({
          from: userAccount,
          value: web3.utils.toWei("1", "ether"),
        });
        totalGasUsedDeposit += depositTx.receipt.gasUsed;

        // Record contract and user balance after deposit
        const contractBalanceAfterDeposit = await web3.eth.getBalance(contractInstance.address);
        const userBalanceAfterDeposit = await contractInstance.balances(userAccount);

        // User withdraws all their funds
        const withdrawTx = await contractInstance.withdraw({
          from: userAccount,
        });
        totalGasUsedWithdraw += withdrawTx.receipt.gasUsed;

        // Record contract and user balance after withdrawal
        const contractBalanceAfterWithdraw = await web3.eth.getBalance(contractInstance.address);
        const userBalanceAfterWithdraw = await contractInstance.balances(userAccount);

        // Check balances
        assert.equal(
          web3.utils.fromWei(userBalanceAfterWithdraw, "ether"),
          "0",
          "User balance should be 0 ETH"
        );

        if (i === numRuns - 1) {
          finalContractBalance = web3.utils.fromWei(contractBalanceAfterWithdraw, "ether");
          finalUserBalance = web3.utils.fromWei(userBalanceAfterWithdraw, "ether");
        }
      }

      const averageGasUsedDeploy = totalGasUsedDeploy / numRuns;
      const averageGasUsedDeposit = totalGasUsedDeposit / numRuns;
      const averageGasUsedWithdraw = totalGasUsedWithdraw / numRuns;

      console.log(`\n=== ${contractName} ===`);
      console.log(`Average gas used for deployment: ${averageGasUsedDeploy}`);
      console.log(`Average gas used for deposit: ${averageGasUsedDeposit}`);
      console.log(`Average gas used for withdrawal: ${averageGasUsedWithdraw}`);
      console.log(`Final contract balance: ${finalContractBalance} ETH`);
      console.log(`Final user balance in contract: ${finalUserBalance} ETH`);
    }

    await testPullPaymentContract(SecurePullPayment, "SecurePullPayment");
  });

  it("should test SecureOZReentrancyGuard contract", async () => {
    await testContract(SecureOZReentrancyGuard, "SecureOZReentrancyGuard");
  });
});
