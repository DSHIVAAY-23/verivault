#![no_main]
sp1_zkvm::entrypoint!(main);

use sp1_zkvm::io;
use sp1_zkvm::lib::verify::verify_sp1_proof;

pub fn main() {
    // Input: A batch of verification keys and public values
    // In a real aggregation scheme, we would pass the actual proofs and verify them.
    // However, sp1-sdk's recursion usually involves `client.prove_compressed` or `client.prove_recursion` 
    // which wraps the logic automatically or provides specific inputs.
    
    // For this hardened manual aggregation task, we define a program that expects:
    // 1. The VKEY of the inner program (verivault-guest)
    // 2. A list of Public Value Digests from the inner executions
    
    let vkey = io::read::<[u32; 8]>();
    let public_values_digests = io::read::<Vec<[u8; 32]>>();
    
    for val in public_values_digests {
        verify_sp1_proof(&vkey, &val);
    }
    
    // If we reached here, all proofs are valid.
    // We commit a summary (e.g., hash of all hashes, or just true)
    io::commit(&true);
}
