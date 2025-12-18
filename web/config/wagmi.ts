import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, foundry } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
    appName: 'VeriVault Pro',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64',
    chains: [sepolia, foundry],
    transports: {
        [sepolia.id]: http('https://chain.instanodes.io/eth-testnet/?apikey=4e4e85545c34453a0d8f298629f51b8c'),
    },
    ssr: true,
});
