use alloy::{
    network::EthereumWallet,
    providers::{ProviderBuilder},
    signers::local::PrivateKeySigner,
    sol,
    primitives::{Address, Bytes},
};
use sp1_sdk::{ProverClient, SP1Stdin, HashableKey};
use std::env;
use std::str::FromStr;
use verivault_core::{Trade, PortfolioState, RiskParams, Fixed, TradeSide};
use dotenv::dotenv;
use anyhow::Result;

// Define the contract interface
sol! {
    #[sol(rpc)]
    contract Vault {
        function executeTrade(bytes calldata _publicValues, bytes calldata _proofBytes) external;
    }
}

/// The ELF (executable) of the guest program.
const GUEST_ELF: &[u8] = sp1_sdk::include_elf!("verivault-guest");

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();
    sp1_sdk::utils::setup_logger();

    println!("Starting VeriVault Operator...");

    let rpc_url = env::var("RPC_URL").expect("RPC_URL must be set");
    let private_key = env::var("PRIVATE_KEY").expect("PRIVATE_KEY must be set");
    let vault_address_str = env::var("VAULT_ADDRESS").expect("VAULT_ADDRESS must be set");
    let vault_address = Address::from_str(&vault_address_str)?;

    // 1. Setup Chain Provider
    let signer = PrivateKeySigner::from_str(&private_key)?;
    let wallet = EthereumWallet::from(signer);
    let provider = ProviderBuilder::new()
        .wallet(wallet)
        .on_http(rpc_url.parse()?);

    let vault_contract = Vault::new(vault_address, provider);

    // 2. Setup SP1 Prover
    let client = ProverClient::from_env();
    let (pk, vk) = client.setup(GUEST_ELF);
    println!("SP1 Setup Complete. VK: {:?}", vk.bytes32());

    // 3. Mock Trading Loop
    // In a real app, this would listen to a queue or websocket
    println!("\n--- Initiating Mock Trade Sequence ---");
    
    // Create Dummy Data
    let trade = Trade {
        asset: 1,
        amount: Fixed::from_num(100),
        price: Fixed::from_num(50),
        side: TradeSide::Buy,
    };
    let state = PortfolioState {
        equity: Fixed::from_num(10000),
        total_exposure: Fixed::from_num(0),
    };
    let risk_params = RiskParams {
        max_leverage: Fixed::from_num(5),
        min_equity: Fixed::from_num(10), // 10%
    };

    println!("Generating Proof for Trade: {:?}...", trade.side);
    
    let mut stdin = SP1Stdin::new();
    stdin.write(&trade);
    stdin.write(&state);
    stdin.write(&risk_params);

    // Generate Proof
    let proof = client.prove(&pk, &stdin).run().expect("Proof generation failed");
    println!("Proof generated successfully!");

    // Extract public values and proof bytes
    // For SP1 v5, public values are in proof.public_values
    // We need to convert them to Bytes for the contract call
    let public_values_bytes = Bytes::from(proof.public_values.to_vec());
    
    // MOCK MODE: For local dev with SP1MockVerifier, we don't need a Plonk proof.
    // Core proofs panic on .bytes() if treated as onchain proofs.
    // We send empty bytes because our MockVerifier accepts anything (or empty).
    let proof_bytes = Bytes::from(vec![]); 
    // If using real verifier: let proof_bytes = Bytes::from(proof.bytes());

    println!("Submitting transaction to Vault at {}...", vault_address_str);

    // Send Transaction with correctly encoded arguments
    // executeTrade(bytes _publicValues, bytes _proofBytes)
    let tx = vault_contract.executeTrade(public_values_bytes, proof_bytes);
    
    let receipt = tx.send().await?.get_receipt().await?;

    println!("Transaction confirmed in block {}", receipt.block_number.unwrap());
    println!("Transaction Hash: {}", receipt.transaction_hash);

    Ok(())
}
