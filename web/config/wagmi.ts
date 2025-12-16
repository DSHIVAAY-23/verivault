import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, foundry } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'VeriVault Pro',
    projectId: 'YOUR_PROJECT_ID', // In production, get from WalletConnect
    chains: [foundry, sepolia],
    ssr: true,
});
