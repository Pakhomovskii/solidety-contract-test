// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureOZReentrancyGuard is ReentrancyGuard {
    mapping(address => uint256) public balances;
    // Добавляем payable конструктор
    constructor() payable {}

    // Функция для депозита эфира
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // Защищенная функция вывода с использованием ReentrancyGuard
    function withdraw(uint256 _amount) external nonReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Внешний вызов
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }
}
