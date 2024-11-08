const Vulnerable = artifacts.require("Vulnerable");
const Attacker = artifacts.require("Attacker");

contract("Vulnerable", (accounts) => {
  it("should allow an attacker to drain funds via reentrancy", async () => {
    // Initial balance
    let balance = await web3.eth.getBalance(accounts[0]);
    console.log(
      "Balance of accounts[0] initially:",
      web3.utils.fromWei(balance, "ether"),
      "ETH"
    );

    // Deploy Vulnerable contract with 500 ETH
    const vulnerable = await Vulnerable.new({
      from: accounts[0],
      value: web3.utils.toWei("500", "ether"),
      gas: 5000000,
      gasPrice: 2000000000,
    });

    balance = await web3.eth.getBalance(accounts[0]);
    console.log(
      "Balance after deploying Vulnerable:",
      web3.utils.fromWei(balance, "ether"),
      "ETH"
    );

    // Deploy Attacker contract
    const attacker = await Attacker.new(vulnerable.address, {
      from: accounts[0],
      gas: 5000000,
      gasPrice: 2000000000,
    });

    balance = await web3.eth.getBalance(accounts[0]);
    console.log(
      "Balance after deploying Attacker:",
      web3.utils.fromWei(balance, "ether"),
      "ETH"
    );

    // Fund the Attacker contract with 1 ETH
    await attacker.fund({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether"),
      gas: 100000,
      gasPrice: 2000000000,
    });

    // Execute the attack with increased gas limit
    await attacker.attack({
      from: accounts[0],
      gas: 10000000, // Increased gas limit
      gasPrice: 2000000000,
    });

    // Final balance of the Attacker contract
    const attackerBalance = await web3.eth.getBalance(attacker.address);
    console.log(
      "Attacker contract balance after attack:",
      web3.utils.fromWei(attackerBalance, "ether"),
      "ETH"
    );

    // Verify that the Attacker drained the funds
    assert(
      web3.utils
        .toBN(attackerBalance)
        .gt(web3.utils.toBN(web3.utils.toWei("10", "ether"))),
      "Attacker did not drain the funds"
    );
  });
});
