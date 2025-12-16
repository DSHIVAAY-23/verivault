import { SolvencyStats } from '@/components/dashboard/SolvencyStats'
import { TradeFeed } from '@/components/dashboard/TradeFeed'
import { PanicBtn } from '@/components/dashboard/PanicBtn'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-black text-white selection:bg-emerald-500/30">
      {/* Header */}
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono lg:flex mb-12">
        <div className="flex items-center gap-4">
          <span className="font-bold text-emerald-400 text-xl tracking-tighter">VERIVAULT</span>
          <span className="hidden md:inline px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            PRO : Localnet (Sepolia Mode)
          </span>
        </div>
        <div className="mt-4 lg:mt-0">
          <ConnectButton />
        </div>
      </div>

      {/* Settings / Panic Area using Dropdown or just hidden details? 
          For MVP PRO mode, we'll put it in a 'Settings' grid on the side or bottom 
      */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Left Col: Market / Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">
            <h2 className="text-zinc-400 mb-4 font-mono text-sm">NETWORK STATUS</h2>
            <SolvencyStats />
          </div>

          <PanicBtn />
        </div>

        {/* Center/Right Col: Feed (Wide) */}
        <div className="md:col-span-2">
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm min-h-[600px]">
            <h2 className="text-zinc-400 mb-6 font-mono text-sm">REAL-TIME PROOF FEED</h2>
            <TradeFeed />
          </div>
        </div>
      </div>

      <p className="mt-12 text-zinc-600 text-xs font-mono">
        VeriVault Phase 6 | Pro Dashboard | ZK-Rollup Solvency Monitor
      </p>
    </main>
  )
}
