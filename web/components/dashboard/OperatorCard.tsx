import { Server, Shield } from "lucide-react";

export function OperatorCard() {
    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-500" />

            <div className="relative z-10">
                <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-4">
                    Operator Status
                </h3>

                <div className="flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live & Secure
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}
