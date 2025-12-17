#!/bin/bash
echo "🚀 Starting VeriVault Traffic Simulator"
echo "Target Vault: $VAULT_ADDRESS"

while true; do
  echo "----------------------------------------"
  echo "⚡ New Trade Request Detected..."
  
  # Run the Operator to process the trade
  cargo run -p verivault-operator --release
  
  echo "✅ Proof On-Chain. Waiting for next batch..."
  
  # Wait 30 seconds before next trade
  sleep 30
done
