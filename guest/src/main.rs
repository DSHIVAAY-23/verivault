#![no_main]

use sp1_zkvm::io;
use verivault_core::{Trade, PortfolioState, RiskParams};

sp1_zkvm::entrypoint!(main);

pub fn main() {
    // 1. Read Inputs
    // Note: The order of reads must match the order of writes in the host
    let trade: Trade = io::read();
    let current_state: PortfolioState = io::read();
    let risk_params: RiskParams = io::read();

    // 2. Risk Check Logic
    // We strictly verify the risk. Ideally, we commit the *new state* as the public output
    // so the verifier contract knows what the new portfolio state is.
    match verivault_core::check_risk(&trade, &current_state, &risk_params) {
        Ok(_new_state) => {
             // 3. Commit Outputs (Public inputs to the verifier contract)
             // For MVP, we just commit 'true' indicating validity.
             // In    // Commit ABI-encoded true (32 bytes, last byte is 1).
    // This allows Solidity abi.decode(..., (bool)) to work.
    let mut output = [0u8; 32];
    // In the Ok branch, the risk check passed, so it's valid.
    output[31] = 1;
    sp1_zkvm::io::commit(&output);
        },
        Err(_) => {
            // Panic causes the ZK proof generation to fail, which is correct.
            // A valid proof essentially means "Code ran cleanly to completion"
            panic!("Risk check failed!");
        }
    }
}
