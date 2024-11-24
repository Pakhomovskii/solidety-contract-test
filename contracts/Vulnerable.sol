// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    mapping(address => uint256) public balances;

    // Добавляем payable конструктор
    constructor() payable {
        // Вы можете добавить инициализацию, если необходимо
    }

    // Функция для депозита эфира
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // Уязвимая функция вывода
    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Уязвимость: внешний вызов перед обновлением состояния
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }
}
