// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVulnerable {
    function deposit() external payable;

    function withdraw(uint256 _amount) external;
}
