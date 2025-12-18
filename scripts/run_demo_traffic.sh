#!/bin/bash
echo "🚀 Starting VeriVault Traffic Simulator"
# Force load .env from current directory, overriding shell vars
set -a
source .env
set +a
echo "Target Vault: $VAULT_ADDRESS"
echo "Target RPC: $RPC_URL"

while true; do
  echo "----------------------------------------"
  echo "⚡ New Trade Request Detected..."
  
  # Run the Operator to process the trade
  # FORCE SEPOLIA RPC (Using User Provided Instanodes)
  RPC_URL='https://chain.instanodes.io/eth-testnet/?apikey=4e4e85545c34453a0d8f298629f51b8c' cargo run -p verivault-operator --release
  
  echo "✅ Proof On-Chain. Waiting for next batch..."
  
  # Wait 30 seconds before next trade
  sleep 30
done
