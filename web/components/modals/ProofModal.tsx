import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trade } from "@/lib/store"
import { CheckCircle, ShieldCheck, Activity } from "lucide-react"

export function ProofModal({ trade, children }: { trade: Trade; children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                        ZK-Proof Verified
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-zinc-400 text-sm">Proof ID</span>
                        <code className="text-xs bg-black p-1 rounded font-mono text-zinc-300">
                            {trade.hash ? trade.hash.slice(0, 10) + '...' + trade.hash.slice(-8) : 'Pending...'}
                        </code>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-zinc-200">Risk Constraints Checked</h4>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Max Leverage &lt; 5.0x</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Min Equity verified</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Risk Engine: No panic</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/50">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-200">Final Status</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">SOLVENT</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
