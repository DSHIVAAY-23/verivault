// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";

contract Vault {
    ISP1Verifier public verifier;
    bytes32 public programVKey;

    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event TradeExecuted(address indexed user, bool success);

    constructor(address _verifier, bytes32 _programVKey) {
        verifier = ISP1Verifier(_verifier);
        programVKey = _programVKey;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Execute a trade based on a valid ZK proof
    /// @param _publicValues The public output of the ZK program (should be the committed state/result)
    /// @param _proofBytes The actual proof
    function executeTrade(bytes calldata _publicValues, bytes calldata _proofBytes) external {
        // 1. Verify the Proof
        // The verifier will revert if the proof is invalid
        verifier.verifyProof(programVKey, _publicValues, _proofBytes);

        // 2. Decode Public Inputs
        // In Phase 1, we just committed `true` (bool). 
        // In a real app, we would decode the new state here.
        bool tradeValid = abi.decode(_publicValues, (bool));
        require(tradeValid, "Trade marked invalid by circuit");

        // 3. Update State
        // For MVP, we just emit an event verifying the proof passed.
        emit TradeExecuted(msg.sender, true);
    }
}
