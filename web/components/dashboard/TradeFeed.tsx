'use client'

import { useWatchContractEvent, usePublicClient } from 'wagmi'
import { useState, useEffect } from 'react'
import { parseAbiItem } from 'viem'
import { VAULT_ABI, VAULT_ADDRESS } from '@/abi/Vault'
import { cn } from '@/lib/utils'
import { Activity } from 'lucide-react'

type TradeLog = {
    hash: string
    user: string
    success: boolean
    timestamp: number
}

export function TradeFeed() {
    const [logs, setLogs] = useState<TradeLog[]>([])

    useWatchContractEvent({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        eventName: 'TradeExecuted',
        onLogs(newLogs) {
            const formattedLogs = newLogs.map((log) => ({
                hash: log.transactionHash,
                user: log.args.user || 'Unknown',
                success: log.args.success || false,
                timestamp: Date.now(),
            }))
            setLogs((prev) => [...formattedLogs, ...prev])
        },
    })

    // Fetch recent history
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

                const formattedHistory = history.map(log => ({
                    hash: log.transactionHash,
                    user: log.args.user || 'Unknown',
                    success: log.args.success || false,
                    timestamp: Date.now(), // Approximate
                })).reverse();

                setLogs(prev => [...prev, ...formattedHistory]);
            } catch (e) {
                console.error("Failed to fetch history", e);
            }
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
                {logs.length === 0 ? (
                    <div className="text-zinc-500 text-sm italic text-center py-8">
                        Waiting for on-chain events...
                    </div>
                ) : (
                    logs.map((log) => (
                        <div
                            key={`${log.hash}-${log.timestamp}`}
                            className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-400 font-mono">
                                    {log.user.slice(0, 6)}...{log.user.slice(-4)}
                                </span>
                                <span className={cn(
                                    "text-sm font-medium",
                                    log.success ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {log.success ? "Trade Executed" : "Trade Failed"}
                                </span>
                            </div>
                            <a
                                href="#"
                                className="text-xs text-blue-400 hover:underline font-mono"
                            >
                                {log.hash.slice(0, 6)}...
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
