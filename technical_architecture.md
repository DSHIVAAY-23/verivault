# VeriVault: Technical Architecture & System Flow

## 1. High-Level Architecture
VeriVault is a **Hybrid Exchange Architecture** (Hex) that combines the speed of off-chain matching with the security of on-chain ZK verification.

### System Diagram
```mermaid
graph TD
    User[User / Traffic Sim] -->|1. Submit Trade| Operator[Rust Operator Node]
    
    subgraph "Off-Chain Trustless Zone"
        Operator -->|2. Inputs| Guest[SP1 Guest Program (ZK Logic)]
        Guest -->|3. Execution Trace| Prover[SP1 Prover SDK]
        Prover -->|4. ZK Proof| Operator
    end
    
    subgraph "On-Chain (Sepolia)"
        Operator -->|5. Submit Transaction| Vault[Vault.sol]
        Vault -->|6. Verify Proof| Verifier[SP1Verifier Contract]
        Verifier -->|7. Valid/Invalid| Vault
        Vault -->|8. Emit Event| EventLog
    end
    
    subgraph "Frontend"
        EventLog -->|9. WebSocket| Dashboard[Next.js Dashboard]
        Dashboard -->|10. Display| UI[User Interface]
    end
```

---

## 2. Component Roles

### A. The Dashboard (`web/`)
*   **Tech**: Next.js 14, RainbowKit, Wagmi, TailwindCSS.
*   **Role**: The "Window" into the system.
*   **Key Function**: It does *not* execute trades directly. Instead, it listens to the blockchain (`useWatchContractEvent`) to reflect the *proven* state of the system. It acts as an independent auditor for the user.
*   **Panic Button**: The only direct user-to-chain interaction. Allows users to bypass the Operator and withdraw funds directly from the smart contract if the Operator goes down.

### B. The Operator (`operator/`)
*   **Tech**: Rust, Tokio (Async), Alloy (Ethereum RPC).
*   **Role**: The "Engine" and Traffic Controller.
*   **Key Function**: 
    1.  Receives trade requests (simulated or real).
    2.  Maintains the **Off-Chain State** (Balances, Order Book).
    3.  Orchestrates the ZK Proof generation.
    4.  Pays gas to submit the proof to Ethereum.
    *   *Note: In a decentralized future, this role would be split among multiple "Provers".*

### C. The Guest Program (`guest/`)
*   **Tech**: Rust (No-std), SP1 zkVM.
*   **Role**: The "Lawyer" / Logic Core.
*   **Key Function**: This code runs *inside* the Zero-Knowledge Exchange.
    1.  It takes inputs (User Balance, Trade Amount, Price).
    2.  It checks constraints: `Is Balance > Amount?`, `Is Leverage < 5x?`, `Is Price valid?`.
    3.  If valid, it outputs the *New Balance*.
    4.  **Crucially**: It cannot be tampered with. If the Operator tries to feed it invalid data, the proof generation simply fails.

### D. The Vault (`contracts/src/Vault.sol`)
*   **Tech**: Solidity, Foundry.
*   **Role**: The "Bank" / Custodian.
*   **Key Function**:
    1.  Holds all user assets (ETH).
    2.  **Stateless**: It doesn't know who owns what (to save gas). It creates a "Commitment" (Root Hash) of the balances.
    3.  **Gatekeeper**: It only allows state changes (withdrawals/trades) if they come attached with a valid ZK Proof verified by the SP1 Verifier.

---

## 3. Data Flow Example: A "Buy" Order 🔄

1.  **Initiation**: 
    The `run_demo_traffic.sh` script generates a "Buy 100 units" request.

2.  **Processing (Off-Chain)**: 
    The **Operator** loads the user's current state and sends it + the trade details to the **Guest Program**.

3.  **Proving (Zero-Knowledge)**: 
    The **SP1 Prover** watches the Guest Program execute. It generates a cryptographic proof (a hex string) that certifies: 
    *"I ran the code 'verivault-guest' on inputs X and Y, and the result was Valid."*

4.  **Submission (On-Chain)**: 
    The Operator sends an Ethereum Transaction: `Vault.executeTrade(proof, public_values)`.

5.  **Verification**: 
    The `Vault.sol` calls `Verifier.verifyProof()`. 
    *   If correct: The Vault emits `TradeExecuted(user, success=true)`.
    *   If fake/invalid: The transaction reverts.

6.  **Updates**: 
    The **Dashboard** picks up the `TradeExecuted` event via RPC and shows "VERIFIED" to the user.
