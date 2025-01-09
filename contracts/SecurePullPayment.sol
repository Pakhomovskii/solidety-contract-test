// SPDX-License-Identifier: MIT
//SecurePullPayment.sol
// The Pull Payment pattern is implemented based on the recommendations of the official Solidity documentation and the enhancements proposed by Ge (2021)

pragma solidity ^0.8.0;

contract SecurePullPayment {
    mapping(address => uint256) public balances;

    constructor() payable {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Effects: Update state before external call
        balances[msg.sender] = 0;

        // Interaction: External Challenge
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }
}
