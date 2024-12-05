// SPDX-License-Identifier: MIT
// SecureMutex.sol

pragma solidity ^0.8.0;

contract SecureMutex {
    mapping(address => uint256) public balances;
    bool private locked;

    constructor() payable {}

    modifier noReentrant() {
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external noReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // External call
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }
}
