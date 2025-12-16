'use client'

import { useVault } from "@/lib/hooks/useVault"
import { AlertTriangle, Lock } from "lucide-react"
import { useState } from "react"
import { parseEther } from "viem"

export function PanicBtn() {
    const { requestWithdraw, forceWithdraw } = useVault()
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'request' | 'force'>('request')

    const handleAction = async () => {
        setLoading(true)
        try {
            if (mode === 'request') {
                await requestWithdraw()
                setMode('force') // Assuming success locally for UI flow
            } else {
                // Hardcoded 0.01 ETH for demo panic
                await forceWithdraw(parseEther("0.01"))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 bg-red-950/10 border border-red-900/30 rounded-xl mt-8">
            <div className="flex items-center gap-2 mb-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold text-sm">Emergency Controls</h3>
            </div>
            <p className="text-xs text-red-300/60 mb-4">
                Use this only if the Operator is censoring your transactions.
                <br />
                1. Request Withdraw (Starts 3-day timer)
                <br />
                2. Force Withdraw (After timer expires)
            </p>

            <button
                onClick={handleAction}
                disabled={loading}
                className="w-full py-2 px-4 bg-red-900/20 hover:bg-red-900/40 border border-red-900 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
                {loading ? 'Processing...' : mode === 'request' ? (
                    <>
                        <Lock className="h-4 w-4" /> Request Escape Hatch
                    </>
                ) : (
                    <>
                        <AlertTriangle className="h-4 w-4" /> Force Withdraw (0.01 ETH)
                    </>
                )}
            </button>
        </div>
    )
}
