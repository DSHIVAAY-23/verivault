// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract Vault is ReentrancyGuard {
    ISP1Verifier public verifier;
    bytes32 public programVKey;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public withdrawalRequests; // User -> Timestamp
    uint256 public constant WITHDRAWAL_DELAY = 3 days;

    event Deposit(address indexed user, uint256 amount);
    event TradeExecuted(address indexed user, bool success);
    event WithdrawalRequested(address indexed user, uint256 timestamp);
    event WithdrawalForced(address indexed user, uint256 amount);

    constructor(address _verifier, bytes32 _programVKey) {
        verifier = ISP1Verifier(_verifier);
        programVKey = _programVKey;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Request to withdraw funds. Starts the timelock.
    function requestWithdraw() external {
        require(balances[msg.sender] > 0, "No balance to withdraw");
        withdrawalRequests[msg.sender] = block.timestamp;
        emit WithdrawalRequested(msg.sender, block.timestamp);
    }

    /// @notice Force withdrawal after timelock expires (Escape Hatch)
    function forceWithdraw(uint256 amount) external nonReentrant {
        uint256 reqTime = withdrawalRequests[msg.sender];
        require(reqTime > 0, "No withdrawal requested");
        require(block.timestamp >= reqTime + WITHDRAWAL_DELAY, "Timelock not expired");
        require(amount <= balances[msg.sender], "Insufficient balance");

        balances[msg.sender] -= amount;
        
        // Let's require re-request to prevent draining re-deposits instantly for safety.
        if (balances[msg.sender] == 0) {
            delete withdrawalRequests[msg.sender];
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawalForced(msg.sender, amount);
    }

    /// @notice Execute a trade based on a valid ZK proof
    function executeTrade(bytes calldata _publicValues, bytes calldata _proofBytes) external nonReentrant {
        // 1. Verify the Proof
        verifier.verifyProof(programVKey, _publicValues, _proofBytes);

        // 2. Decode Public Inputs
        bool tradeValid = abi.decode(_publicValues, (bool));
        require(tradeValid, "Trade marked invalid by circuit");

        // 3. Update State
        emit TradeExecuted(msg.sender, true);
    }
}
