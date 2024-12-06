// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdvancedCEI {
    mapping(address => uint256) public balances; // Tracks user balances
    mapping(address => uint256) public lastInteraction; // Tracks the last interaction timestamp

    uint256 public cooldownTime = 1 minutes; // Cooldown period between actions

    // Events for logging actions
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ActionFailed(address indexed user, string reason);

    constructor() payable {}

    // Function for depositing funds
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        // Effects: Update the state
        balances[msg.sender] += msg.value;

        // Log the successful deposit
        emit Deposit(msg.sender, msg.value);
    }

    // Function for withdrawing funds with cooldown protection
    function withdraw(uint256 _amount) external {
        // Check if the cooldown time has passed since the last interaction
        if (block.timestamp < lastInteraction[msg.sender] + cooldownTime) {
            emit ActionFailed(msg.sender, "Cooldown time not met");
            return;
        }

        // Check if the user has sufficient balance
        if (balances[msg.sender] < _amount) {
            emit ActionFailed(msg.sender, "Insufficient balance");
            return;
        }

        // Effects: Update state before the external call
        balances[msg.sender] -= _amount;
        lastInteraction[msg.sender] = block.timestamp; // Update the last interaction timestamp

        // Interaction: Perform the external call
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        if (!success) {
            // Revert the state in case of failure
            balances[msg.sender] += _amount;
            emit ActionFailed(msg.sender, "Transfer failed");
            return;
        }

        // Log the successful withdrawal
        emit Withdraw(msg.sender, _amount);
    }

    // Function to check a user's balance
    function getBalance(address _user) external view returns (uint256) {
        return balances[_user];
    }

    // Admin function to update the cooldown time
    function updateCooldownTime(uint256 _newTime) external {
        cooldownTime = _newTime;
    }
}
