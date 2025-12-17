# Deployment & Custom Domain Guide

## 1. Deploying to Vercel
1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in with GitHub.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repository**: Select `DSHIVAAY-23/verivault`.
4.  **Framework Preset**: It should auto-detect **Next.js**.
5.  **Root Directory**: Click "Edit" and select `web` (since your frontend is in the `web/` folder).
6.  **Environment Variables**:
    *   Copy contents of `web/.env.local` (if any, currently we hardcoded constants for the demo).
    *   *Note*: Since we hardcoded `VAULT_ADDRESS` and `RPC` in `wagmi.ts`, you might not need any env vars for the basic demo.
7.  **Deploy**: Click "Deploy".

## 2. Connecting `vanijya.in`
Once deployment is complete:
1.  Go to the **Project Settings** in Vercel.
2.  Click **Domains** on the left sidebar.
3.  Enter `vanijya.in` in the input field and click **Add**.
4.  **DNS Configuration**:
    *   Vercel will give you an **A Record** (e.g., `76.76.21.21`) or **CNAME**.
    *   Log in to your Domain Registrar (Godaddy, Namecheap, etc.) for `vanijya.in`.
    *   Update your DNS records to point to Vercel's values.
5.  Wait for SSL generation (usually < 15 mins).

## 3. "Demo Mode" on Frontend
I am adding a **"Simulate Process"** button to your dashboard.
This will allow you to manually trigger a visual sequence of the backend steps:
1.  **"Risk Engine Calculating..."**
2.  **"Generating ZK-Proof (SP1)..."**
3.  **"Submitting to Sepolia..."**
4.  **"Verified"**

This is perfect for live demos where you don't want to wait for real block times.
