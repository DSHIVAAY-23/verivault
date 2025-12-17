import { ShieldCheck } from "lucide-react";

export function ZKCard() {
    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />

            <div className="relative z-10">
                <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-4">
                    ZK-Verification
                </h3>

                <div className="flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        SP1 Proofs Active
                    </div>

                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}
