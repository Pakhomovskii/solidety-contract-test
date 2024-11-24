// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IVulnerable.sol";

contract Secure is IVulnerable {
    mapping(address => uint256) public balances;
    bool private locked;

    constructor() payable {
        balances[msg.sender] = msg.value;
    }

    modifier noReentrancy() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    function deposit() external payable override {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external override noReentrancy {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        balances[msg.sender] -= _amount;

        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed.");
    }
}
