# VeriVault Frontend Structure

This document outlines the architecture for the "Pro" version of the dashboard.

## Folder Structure

```
web/
├── app/
│   ├── layout.tsx         # Global Providers (Wagmi, QueryClient) + RainbowKitProvider
│   ├── page.tsx           # Main Dashboard
│   └── globals.css        # Tailwind + Shadcn styles
├── components/
│   ├── dashboard/
│   │   ├── TradeFeed.tsx  # Optimistic Feed + Real-time Events
│   │   ├── Solvency.tsx   # TVL & Operator Status
│   │   └── PanicBtn.tsx   # Emergency Withdraw (hidden/settings)
│   ├── ui/                # Shadcn UI primitives (Button, Card, Dialog)
│   └── modals/
│       └── ProofModal.tsx # Proof Explorer Detail View
├── lib/
│   ├── hooks/             # Custom Wagmi Hooks
│   │   ├── useVault.ts    # useReadContract / useWriteContract for Vault
│   │   └── useFeed.ts     # Event listening logic
│   ├── store.ts           # Zustand store for local trade state
│   └── utils.ts           # Helper functions
├── config/
│   └── wagmi.ts           # Chain config (Sepolia + Anvil)
└── abi/
    ├── Vault.ts           # Hardcoded ABI
    └── deployments.json   # Auto-generated addresses
```

## Wagmi Hook Organization

### 1. `useVault.ts`
Encapsulate all contract interactions here.
```typescript
export const useVault = () => {
  const { writeContract } = useWriteContract()
  
  const forceWithdraw = (amount: bigint) => {
    writeContract({
      abi: VAULT_ABI,
      address: VAULT_ADDRESS,
      functionName: 'forceWithdraw',
      args: [amount]
    })
  }

  return { forceWithdraw }
}
```

### 2. Event Listening
Use `useWatchContractEvent` in `useFeed.ts` to keep the UI decoupled from raw log parsing.

## State Management (Zustand)
Use `lib/store.ts` to track "Optimistic" trades that haven't settled yet.

```typescript
type Trade = { id: string, status: 'processing' | 'settled', ... }
export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  addTrade: (t) => set((state) => ({ trades: [t, ...state.trades] })),
}))
```
