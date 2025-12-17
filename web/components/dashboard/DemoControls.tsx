'use client'

import { useTradeStore } from "@/lib/store"
import { Play, RotateCcw } from "lucide-react"

export function DemoControls() {
    const { addTrade, updateTrade } = useTradeStore()

    const runSimulation = () => {
        const id = "demo-" + Date.now()

        // Step 1: Request
        addTrade({
            id,
            user: "0x1234...5678",
            status: 'processing',
            success: false,
            timestamp: Date.now(),
            hash: undefined
        })

        // Step 2: Proving (after 2s)
        setTimeout(() => {
            updateTrade(id, { status: 'proving' })
        }, 2000)

        // Step 3: Submitting (after 5s)
        setTimeout(() => {
            updateTrade(id, { status: 'submitting' })
        }, 5000)

        // Step 4: Verified (after 8s)
        setTimeout(() => {
            updateTrade(id, {
                status: 'verified',
                success: true,
                hash: "0x" + Math.random().toString(16).slice(2) + "..."
            })
        }, 8000)
    }

    return (
        <div className="fixed bottom-4 right-4 flex gap-2">
            <button
                onClick={runSimulation}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-xs font-mono text-emerald-400 transition-colors shadow-lg"
            >
                <Play className="w-3 h-3" /> DEMO FLOW
            </button>
        </div>
    )
}
