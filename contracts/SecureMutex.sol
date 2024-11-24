// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureMutex {
    mapping(address => uint256) public balances;
    bool private locked;
    // Добавляем payable конструктор
    constructor() payable {}

    // Модификатор для предотвращения повторного входа
    modifier noReentrant() {
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    // Функция для депозита эфира
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // Защищенная функция вывода с использованием мьютекса
    function withdraw(uint256 _amount) external noReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Внешний вызов
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }
}
