// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    mapping(address => uint256) public balances;

    constructor() payable {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }
}
