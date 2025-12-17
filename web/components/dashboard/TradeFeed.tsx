'use client'

import { useWatchContractEvent, usePublicClient } from 'wagmi'
import { useState, useEffect } from 'react'
import { parseAbiItem } from 'viem'
import { VAULT_ABI, VAULT_ADDRESS } from '@/abi/Vault'
import { cn } from '@/lib/utils'
import { Activity, Loader2, CheckCircle2 } from 'lucide-react'
import { useTradeStore, Trade } from '@/lib/store'
import { ProofModal } from '@/components/modals/ProofModal'

export function TradeFeed() {
    const { trades, addTrade, updateTrade } = useTradeStore()

    // Listen for real confirmations
    useWatchContractEvent({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        eventName: 'TradeExecuted',
        onLogs(newLogs) {
            newLogs.forEach((log) => {
                const incomingHash = log.transactionHash
                const exists = trades.find(t => t.hash === incomingHash)

                if (exists) {
                    updateTrade(exists.id, { status: 'verified', hash: incomingHash })
                } else {
                    addTrade({
                        id: incomingHash,
                        user: log.args.user || 'Unknown',
                        success: log.args.success || false,
                        status: 'verified',
                        timestamp: Date.now(),
                        hash: incomingHash
                    })
                }
            })
        },
    })

    // Initial Load
    const publicClient = usePublicClient()
    useEffect(() => {
        if (!publicClient) return;
        async function fetchHistory() {
            try {
                // @ts-ignore
                const history = await publicClient.getLogs({
                    address: VAULT_ADDRESS,
                    event: parseAbiItem('event TradeExecuted(address indexed user, bool success)'),
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                });

                const formatted = history.map(log => ({
                    id: log.transactionHash,
                    user: log.args.user || 'Unknown',
                    success: log.args.success || false,
                    status: 'verified' as const,
                    timestamp: Date.now(), // Approximate for old logs
                    hash: log.transactionHash
                })).reverse();

                // Simple dedup based on hash
                formatted.forEach(t => {
                    if (!trades.find(existing => existing.hash === t.hash)) {
                        addTrade(t)
                    }
                })
            } catch (e) { console.error(e) }
        }
        fetchHistory();
    }, [publicClient]);

    return (
        <div className="w-full max-w-md p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <Activity className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Live Trade Feed</h2>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {trades.length === 0 ? (
                    <div className="text-zinc-500 text-sm italic text-center py-8">
                        Waiting for on-chain events...
                    </div>
                ) : (
                    trades.map((trade) => (
                        <ProofModal key={trade.id} trade={trade}>
                            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between hover:border-emerald-500/50 cursor-pointer transition-colors group">
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                                        {trade.user.slice(0, 6)}...{trade.user.slice(-4)}
                                    </span>
                                    <span className={cn(
                                        "text-sm font-medium flex items-center gap-1",
                                        trade.status === 'verified' ? "text-emerald-400" :
                                            trade.status === 'failed' ? "text-red-400" : "text-yellow-400"
                                    )}>
                                        {trade.status === 'processing' && (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin" /> Risk Checks...
                                            </>
                                        )}
                                        {trade.status === 'proving' && (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin text-blue-400" /> SP1 Proving...
                                            </>
                                        )}
                                        {trade.status === 'submitting' && (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin text-purple-400" /> On-Chain...
                                            </>
                                        )}
                                        {trade.status === 'verified' && (
                                            <>
                                                <CheckCircle2 className="h-3 w-3" /> ZK Verified
                                            </>
                                        )}
                                    </span>
                                </div>
                                <span className="text-xs text-zinc-600 font-mono group-hover:text-emerald-400 transition-colors">
                                    {trade.hash ? trade.hash.slice(0, 6) + '...' : 'pending'}
                                </span>
                            </div>
                        </ProofModal>
                    ))
                )}
            </div>
        </div>
    )
}
