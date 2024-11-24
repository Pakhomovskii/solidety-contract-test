const Vulnerable = artifacts.require("Vulnerable");
const SecureCEI = artifacts.require("SecureCEI");
const SecureMutex = artifacts.require("SecureMutex");
const SecurePullPayment = artifacts.require("SecurePullPayment");
const SecureOZReentrancyGuard = artifacts.require("SecureOZReentrancyGuard");
const Attacker = artifacts.require("Attacker");

contract("Reentrancy Attack Tests", (accounts) => {
  const attackerAccount = accounts[1];
  const numRuns = 5; // Количество запусков для усреднения потребления газа

  async function performAttack(contractArtifact, contractName) {
    let totalGasUsedDeploy = 0;
    let totalGasUsedAttack = 0;
    let attackSuccessful = false;
    let attackerFinalBalance;
    let targetFinalBalance;

    for (let i = 0; i < numRuns; i++) {
      // Развертывание целевого контракта с 10 ETH
      const targetContractInstance = await contractArtifact.new({
        from: accounts[0],
        value: web3.utils.toWei("10", "ether"),
      });
      totalGasUsedDeploy += targetContractInstance.transactionHash
        ? (await web3.eth.getTransactionReceipt(targetContractInstance.transactionHash)).gasUsed
        : 0;

      // Развертывание атакующего контракта
      const attackerContractInstance = await Attacker.new(targetContractInstance.address, {
        from: attackerAccount,
      });

      // Финансирование атакующего контракта 1 ETH
      await attackerContractInstance.fund({
        from: attackerAccount,
        value: web3.utils.toWei("1", "ether"),
      });

      // Записываем баланс целевого контракта перед атакой
      const targetBalanceBefore = await web3.eth.getBalance(targetContractInstance.address);

      // Пытаемся выполнить атаку
      try {
        const tx = await attackerContractInstance.attack({
          from: attackerAccount,
          gas: 5000000,
        });
        totalGasUsedAttack += tx.receipt.gasUsed;

        // Проверяем, был ли баланс целевого контракта уменьшен
        const targetBalanceAfter = await web3.eth.getBalance(targetContractInstance.address);

        if (
          web3.utils
            .toBN(targetBalanceAfter)
            .lt(web3.utils.toBN(targetBalanceBefore).sub(web3.utils.toBN(web3.utils.toWei("1", "ether"))))
        ) {
          attackSuccessful = true;
        }

        // Записываем балансы после последнего запуска
        if (i === numRuns - 1) {
          const attackerBalance = await web3.eth.getBalance(attackerContractInstance.address);
          attackerFinalBalance = web3.utils.fromWei(attackerBalance, "ether");
          targetFinalBalance = web3.utils.fromWei(targetBalanceAfter, "ether");
        }
      } catch (error) {
        // Атака не удалась, фиксируем это
        attackSuccessful = false;

        // Записываем балансы после последнего запуска
        if (i === numRuns - 1) {
          const attackerBalance = await web3.eth.getBalance(attackerContractInstance.address);
          attackerFinalBalance = web3.utils.fromWei(attackerBalance, "ether");

          const targetBalance = await web3.eth.getBalance(targetContractInstance.address);
          targetFinalBalance = web3.utils.fromWei(targetBalance, "ether");
        }
      }
    }

    const averageGasUsedDeploy = totalGasUsedDeploy / numRuns;
    const averageGasUsedAttack = totalGasUsedAttack / numRuns;

    console.log(`\n=== ${contractName} ===`);
    console.log(`Average gas consumption during deployment: ${averageGasUsedDeploy}`);
    console.log(`Average gas consumption during attack: ${averageGasUsedAttack}`);
    console.log(`Attack successful: ${attackSuccessful ? 'Yes' : 'No'}`);
    console.log(`Attacker contract balance after attack: ${attackerFinalBalance} ETH`);
    console.log(`Target contract balance after attack: ${targetFinalBalance} ETH`);
  }

  it("should test Vulnerable contract", async () => {
    await performAttack(Vulnerable, "Vulnerable");
  });

  it("should test SecureCEI contract", async () => {
    await performAttack(SecureCEI, "SecureCEI");
  });

  it("should test SecureMutex contract", async () => {
    await performAttack(SecureMutex, "SecureMutex");
  });

  it("should test SecurePullPayment contract", async () => {
    await performAttack(SecurePullPayment, "SecurePullPayment");
  });

  it("should test SecureOZReentrancyGuard contract", async () => {
    await performAttack(SecureOZReentrancyGuard, "SecureOZReentrancyGuard");
  });
});
