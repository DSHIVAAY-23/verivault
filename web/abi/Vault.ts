export const VAULT_ADDRESS = "0x6603461bF090D5689a46192F22285Fe9d01Bfcf0" as const;

export const VAULT_ABI = [
    {
        "type": "constructor",
        "inputs": [
            { "name": "_verifier", "type": "address", "internalType": "address" },
            { "name": "_programVKey", "type": "bytes32", "internalType": "bytes32" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "balances",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "deposit",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "executeTrade",
        "inputs": [
            { "name": "_publicValues", "type": "bytes", "internalType": "bytes" },
            { "name": "_proofBytes", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "forceWithdraw",
        "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "programVKey",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "requestWithdraw",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "verifier",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "contract ISP1Verifier" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "withdrawalRequests",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "Deposit",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TradeExecuted",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "success", "type": "bool", "indexed": false, "internalType": "bool" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WithdrawalForced",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WithdrawalRequested",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    }
] as const;
