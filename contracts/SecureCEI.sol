// SPDX-License-Identifier: MIT
// SecureCEI.sol

pragma solidity ^0.8.0;

contract SecureCEI {
    mapping(address => uint256) public balances;

    constructor() payable {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Effects: Update state before external call
        balances[msg.sender] -= _amount;

        // Interaction: External Challenge
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
    }
}
