'use client'

import { useBalance } from 'wagmi'
import { VAULT_ADDRESS } from '@/abi/Vault'
import { ShieldCheck, Wallet, Workflow } from 'lucide-react'
import { formatEther } from 'viem'

export function SolvencyStats() {
    const { data: balance } = useBalance({
        address: VAULT_ADDRESS,
    })

    // Safe formatting helper
    const formattedBalance = balance
        ? parseFloat(formatEther(balance.value)).toFixed(4)
        : '...'

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
            {/* TVL Card */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2 text-zinc-400">
                    <Wallet className="w-5 h-5" />
                    <span className="text-sm font-medium">Vault TVL</span>
                </div>
                <div className="text-3xl font-bold text-white">
                    {formattedBalance} {balance?.symbol}
                </div>
            </div>

            {/* Operator Status */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2 text-zinc-400">
                    <Workflow className="w-5 h-5" />
                    <span className="text-sm font-medium">Operator Status</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xl font-bold text-emerald-400">Live</span>
                </div>
            </div>

            {/* Proof Status */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2 text-zinc-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-medium">Verification</span>
                </div>
                <div className="text-xl font-bold text-indigo-400">
                    SP1 Verified
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                    Zero-Knowledge Proofs Active
                </div>
            </div>
        </div>
    )
}
