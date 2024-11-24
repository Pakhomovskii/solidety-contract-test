// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureCEI {
    mapping(address => uint256) public balances;

    // Добавляем payable конструктор
    constructor() payable {}

    // Функция для депозита эфира
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // Защищенная функция вывода с использованием шаблона CEI
    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Эффекты: обновление состояния перед внешним вызовом
        balances[msg.sender] -= _amount;

        // Взаимодействие: внешний вызов
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
    }
}
