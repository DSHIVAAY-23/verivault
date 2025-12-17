# Sepolia Deployment & Real-Time Test Flow

## 1. Deployment (Already Done)
- **Vault Address**: `0x6603461bF090D5689a46192F22285Fe9d01Bfcf0`
- **Verifier**: `SP1MockVerifier` (for easy testing without proving costs)

## 2. Running User Flow (Real-Time Traffic)
To see the system "alive" with trades appearing on the dashboard:

1.  **Open Terminal 1: Frontend**
    ```bash
    cd web
    npm run dev
    ```
    *Go to `http://localhost:3000`*

2.  **Open Terminal 2: The Operator (Traffic Generator)**
    This script simulates user activity by generating a random trade, proving it (locally), and submitting it to Sepolia every 30 seconds.
    ```bash
    ./scripts/run_demo_traffic.sh
    ```

3.  **Use Pulse**
    - Watch the **Real-Time Proof Feed** on the Dashboard.
    - You will see "Processing..." turn into "Verified" as Sepolia confirms the transactions.

## 3. Emergency Testing
1.  Click the **Panic Button** on the Dashboard.
2.  Approve the transaction in your Wallet (MetaMask/Rainbow).
3.  See the "Request Escape Hatch" event trigger on Etherscan.
