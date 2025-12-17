'use client'

import { useVaultBalance } from '@/lib/hooks/useVault'
import { formatEther } from 'viem'
import { TrendingUp } from "lucide-react"

export function SolvencyStats() {
    const { data: balance } = useVaultBalance()

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Gradient/Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-wider">
                        Vault Overview
                    </h3>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold tracking-tight text-white">
                                ${balance ? (Number(formatEther(balance)) * 3400).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                            </span>
                            <span className="text-sm font-medium text-zinc-500">USD</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Total Value Locked (TVL)</p>
                    </div>

                    {/* Decorative Sparkline */}
                    <div className="h-12 w-24 relative">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path
                                d="M0 40 Q 10 35, 20 38 T 40 20 T 60 25 T 80 10 T 100 5"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_#60a5fa]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
