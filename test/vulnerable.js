const Secure = artifacts.require("Secure");
const Vulnerable = artifacts.require("Vulnerable");
const Attacker = artifacts.require("Attacker");

contract("Reentrancy Test", (accounts) => {
  it("should compare Secure and Vulnerable contracts with average gas consumption", async () => {
    const attackerAccount = accounts[1];
    const numRuns = 5;
    async function performAttack(contractArtifact, contractName) {
      let totalGasUsed = 0;
      let attackerFinalBalance;
      let targetFinalBalance;

      for (let i = 0; i < numRuns; i++) {

        const targetContract = await contractArtifact.new({
          from: accounts[0],
          value: web3.utils.toWei("10", "ether"),
        });

        const attackerContract = await Attacker.new(targetContract.address, {
          from: attackerAccount,
        });

        await attackerContract.fund({
          from: attackerAccount,
          value: web3.utils.toWei("1", "ether"),
        });

        const tx = await attackerContract.attack({
          from: attackerAccount,
          gas: 5000000,
        });

        totalGasUsed += tx.receipt.gasUsed;

        if (contractName === "Vulnerable") {
          const targetBalance = await web3.eth.getBalance(targetContract.address);
          assert(
            web3.utils
              .toBN(targetBalance)
              .lt(web3.utils.toBN(web3.utils.toWei("1", "ether"))),
            "Attask he Vulnerable contract filed!"
          );
        }

        if (i === numRuns - 1) {
          const attackerBalance = await web3.eth.getBalance(
            attackerContract.address
          );
          attackerFinalBalance = web3.utils.fromWei(attackerBalance, "ether");

          const targetBalance = await web3.eth.getBalance(targetContract.address);
          targetFinalBalance = web3.utils.fromWei(targetBalance, "ether");
        }
      }

      const averageGasUsed = totalGasUsed / numRuns;

      console.log(
        `Average gas consumption during attack on ${contractName}:`,
        averageGasUsed
      );

      console.log(
        `Balance attacking contract after attacks on ${contractName}:`,
        attackerFinalBalance,
        "ETH"
      );

      console.log(
        `Balance ${contractName} cantract after attack:`,
        targetFinalBalance,
        "ETH"
      );
    }

    console.log("=== Secure contract ===");
    await performAttack(Secure, "Secure");

    console.log("\n===  Vulnerable contract ===");
    await performAttack(Vulnerable, "Vulnerable");
  });
});
