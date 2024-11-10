const Secure = artifacts.require("Secure");
const Attacker = artifacts.require("Attacker");

contract("Secure", (accounts) => {
  it("should prevent reentrancy attack", async () => {
    // Initial balance
    let balance = await web3.eth.getBalance(accounts[0]);
    console.log(
      "Balance of accounts[0] initially:",
      web3.utils.fromWei(balance, "ether"),
      "ETH"
    );

    // Deploy Secure contract with 10 ETH
    const secure = await Secure.new({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
      gas: 5000000,
      gasPrice: 2000000000,
    });

    // Deploy Attacker contract
    const attacker = await Attacker.new(secure.address, {
      from: accounts[0],
      gas: 5000000,
      gasPrice: 2000000000,
    });

    // Fund the Attacker contract with 1 ETH
    await attacker.fund({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether"),
      gas: 100000,
      gasPrice: 2000000000,
    });

    // Attempt to perform the attack
    await attacker.attack({
      from: accounts[0],
      gas: 5000000,
      gasPrice: 2000000000,
    });

    // Check the balance of the Attacker contract
    const attackerBalance = await web3.eth.getBalance(attacker.address);
    console.log(
      "Attacker contract balance after attack attempt:",
      web3.utils.fromWei(attackerBalance, "ether"),
      "ETH"
    );

    // Verify that the Attacker did not drain the funds
    assert(
      web3.utils
        .toBN(attackerBalance)
        .lte(web3.utils.toBN(web3.utils.toWei("2", "ether"))),
      "Attacker was able to drain funds!"
    );

    // Check that the balance of the Secure contract did not significantly decrease
    const secureBalance = await web3.eth.getBalance(secure.address);
    console.log(
      "Secure contract balance after attack attempt:",
      web3.utils.fromWei(secureBalance, "ether"),
      "ETH"
    );

    assert(
      web3.utils
        .toBN(secureBalance)
        .gte(web3.utils.toBN(web3.utils.toWei("9", "ether"))),
      "Secure contract balance should not have been drained"
    );
  });
});
