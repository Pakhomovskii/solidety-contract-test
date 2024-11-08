// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./IVulnerable.sol";

contract Vulnerable is IVulnerable {
    mapping(address => uint256) public balances;

    constructor() public payable {
        balances[msg.sender] = msg.value;
    }

    function deposit() external payable override {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external override {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Уязвимый код: внешняя вызов перед обновлением состояния
        (bool success, ) = msg.sender.call.value(_amount)("");
        require(success, "Transfer failed.");

        balances[msg.sender] -= _amount;
    }
}
