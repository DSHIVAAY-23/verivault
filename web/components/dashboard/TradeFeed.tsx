'use client'

import { useTradeStore } from "@/lib/store"
import { useWatchContractEvent } from "wagmi"
import { VAULT_ABI, VAULT_ADDRESS } from "@/abi/Vault"
import { useEffect, useState } from "react"
import { createPublicClient, http, parseAbiItem } from "viem"
import { sepolia, foundry } from "viem/chains"
import { CheckCircle2, CircleDashed, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProofModal } from "@/components/modals/ProofModal"

const publicClient = createPublicClient({
    // Default to Sepolia for this Pro Demo
    chain: sepolia,
    transport: http('https://chain.instanodes.io/eth-testnet/?apikey=4e4e85545c34453a0d8f298629f51b8c') // User provided Instanodes RPC
})

export function TradeFeed() {
    const { trades, addTrade, updateTrade } = useTradeStore()
    const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)

    // Listen for real contract events
    useWatchContractEvent({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        eventName: 'TradeExecuted',
        onLogs(logs) {
            processLogs(logs)
        },
    })

    // Fetch recent history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const blockNumber = await publicClient.getBlockNumber()
                const logs = await publicClient.getLogs({
                    address: VAULT_ADDRESS,
                    event: parseAbiItem('event TradeExecuted(address indexed user, bool success)'),
                    fromBlock: blockNumber - 100n,
                    toBlock: 'latest'
                })
                processLogs(logs)
            } catch (e) {
                console.error("Failed to fetch history:", e)
            }
        }
        fetchHistory()
    }, [])

    const processLogs = (logs: any[]) => {
        logs.forEach(log => {
            const { user, success } = log.args
            const hash = log.transactionHash

            const pending = trades.find(t => t.user === user && t.status !== 'verified')
            const exists = trades.find(t => t.hash === hash)

            if (exists) return; // Deduplicate

            if (pending) {
                updateTrade(pending.id, {
                    status: 'verified',
                    success: true, // Optimistic success
                    hash
                })
            } else {
                addTrade({
                    id: hash + "-" + log.logIndex,
                    user: user || '0x...',
                    status: 'verified',
                    success: true,
                    timestamp: Date.now(), // Approximate for history
                    hash
                })
            }
        })
    }

    // Helper for relative time
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000)
        if (seconds < 60) return `${seconds}s ago`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        return `${Math.floor(minutes / 60)}h ago`
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">Live Feed</h3>
                </div>
                <a href={`https://sepolia.etherscan.io/address/${VAULT_ADDRESS}`} target="_blank" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Etherscan <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {trades.length === 0 ? (
                    <div className="text-center py-12 text-zinc-600 text-sm font-mono">
                        Waiting for on-chain events...
                    </div>
                ) : (
                    trades.map((trade) => (
                        <div
                            key={trade.id}
                            onClick={() => setSelectedTradeId(trade.id)}
                            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-2 rounded-full",
                                    trade.status === 'verified' ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                                )}>
                                    {trade.status === 'verified' ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                </div>
                                <div>
                                    <p className="text-sm font-mono text-zinc-300 group-hover:text-white transition-colors">
                                        {trade.hash ? trade.hash.slice(0, 8) + '...' + trade.hash.slice(-6) : 'Processing...'}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {timeAgo(trade.timestamp)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {trade.status === 'verified' ? (
                                    <div className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        VERIFIED
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold border",
                                        trade.status === 'proving' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                            trade.status === 'submitting' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    )}>
                                        {trade.status.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Details */}
            <ProofModal
                isOpen={!!selectedTradeId}
                onClose={() => setSelectedTradeId(null)}
                trade={trades.find(t => t.id === selectedTradeId)!}
            />
        </div>
    )
}
