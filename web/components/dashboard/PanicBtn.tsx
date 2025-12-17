'use client'

import { useVault } from "@/lib/hooks/useVault"
import { AlertTriangle, Lock, ShieldAlert } from "lucide-react"
import { useState, useEffect } from "react"
import { parseEther } from "viem"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function PanicBtn() {
    const { requestWithdraw, forceWithdraw } = useVault()
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'request' | 'force'>('request')
    const [open, setOpen] = useState(false)

    // Countdown state (mock for UI)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)

    useEffect(() => {
        if (open && mode === 'force') {
            // Start 15 min countdown for dramatic effect
            setTimeLeft(15 * 60)
            const interval = setInterval(() => {
                setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0))
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [open, mode])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleTrigger = () => {
        setOpen(true)
    }

    const handleAction = async () => {
        setLoading(true)
        try {
            if (mode === 'request') {
                await requestWithdraw()
                setMode('force')
            } else {
                await forceWithdraw(parseEther("0.01"))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass-panel border-red-900/30 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-950/10" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-medium">Emergency Controls</h3>
                </div>

                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Redesigned as a secure, clean panel. Use this only if the Operator is censoring your transactions.
                </p>

                <button
                    onClick={handleTrigger}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium transition-all group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2"
                >
                    <Lock className="w-4 h-4" /> Request Escape Hatch
                </button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-zinc-950 border-red-900/50 text-white sm:max-w-md backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 flex items-center gap-2 text-xl">
                            <AlertTriangle className="w-6 h-6" /> Request Escape Hatch
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-4 text-sm text-zinc-400">
                            <div className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/30 text-red-400 text-xs">1</span>
                                <p>Apply the Escape Hatch to the smart contract.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/30 text-red-400 text-xs">2</span>
                                <p>Open the Escape Hatch to the injection.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/30 text-red-400 text-xs">3</span>
                                <p>Wait for the timelock to expire (3 days).</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/30 text-red-400 text-xs">4</span>
                                <p>Force withdraw your funds.</p>
                            </div>
                        </div>

                        {mode === 'force' && timeLeft !== null && (
                            <div className="text-center py-6 bg-red-950/30 rounded-xl border border-red-900/50">
                                <p className="text-red-400 text-xs uppercase tracking-widest mb-2">Countdown</p>
                                <p className="text-4xl font-mono font-bold text-red-500 text-glow-red animate-pulse">
                                    00:{formatTime(timeLeft)}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleAction}
                            disabled={loading}
                            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
                        >
                            {loading ? 'Processing...' : (mode === 'request' ? 'Initiate Sequence' : 'Force Withdraw')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
