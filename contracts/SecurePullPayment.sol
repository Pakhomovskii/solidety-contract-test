// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecurePullPayment {
    mapping(address => uint256) public balances;

    // Функция для депозита эфира
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    // Добавляем payable конструктор
    constructor() payable {}

    // Функция для вывода средств пользователем
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Эффекты: обновление состояния перед внешним вызовом
        balances[msg.sender] = 0;

        // Взаимодействие: внешний вызов
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
