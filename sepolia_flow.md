# Sepolia Deployment Flow

This document verifies the deployment sequence for VeriVault on Sepolia Testnet.

## 1. Environment Setup
- **Network**: Sepolia (Chain ID: 11155111)
- **RPC**: Private Instanodes RPC
- **Tooling**: Foundry (`forge script`)

## 2. Execution Command
```bash
PRIVATE_KEY=... forge script script/DeploySepolia.s.sol \
  --rpc-url https://chain.instanodes.io/eth-testnet/?apikey=... \
  --broadcast
```

## 3. Transaction Logs
**Timestamp**: 2025-12-16T18:52:14.510Z (approx)
**Commit**: `7a5ad02`

### Deployment 1: SP1Verifier
- **Address**: `0x394ef2b871a56c875cc0514724e64b1ff449b407`
- **Tx Hash**: `0xeb828ec447b36d7491fe17f46b0932a863a344c475965c36165d109e1cf82057`
- **Gas Used**: 160,679

### Deployment 2: Vault
- **Address**: `0x6603461bf090d5689a46192f22285fe9d01bfcf0`
- **Tx Hash**: `0xba6fb180ef0b37c23077905717c312af95f5bbd54bde462a62bd8c9cc88d7d69`
- **Gas Used**: 1,047,011

## 4. Frontend Integration
The `deployments.json` file was updated and copied to `web/abi/`:
```json
{
  "chainId": "11155111",
  "verifier": "0x394ef2b871a56c875cc0514724e64b1ff449b407",
  "vault": "0x6603461bf090d5689a46192f22285fe9d01bfcf0"
}
```

## 5. Verification
To verify contracts on Etherscan:
```bash
forge verify-contract 0x6603461bf090d5689a46192f22285fe9d01bfcf0 src/Vault.sol:Vault \
  --chain sepolia \
  --watch \
  --etherscan-api-key <YOUR_API_KEY>
```
