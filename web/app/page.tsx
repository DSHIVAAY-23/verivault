import { SolvencyStats } from '@/components/dashboard/SolvencyStats'
import { TradeFeed } from '@/components/dashboard/TradeFeed'
import { PanicBtn } from '@/components/dashboard/PanicBtn'
import { ZKCard } from '@/components/dashboard/ZKCard'
import { OperatorCard } from '@/components/dashboard/OperatorCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { DemoControls } from '@/components/dashboard/DemoControls'
import { Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-[1400px] space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tighter text-white">VERIVAULT</h1>
              <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">Trustless Solvency Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400">Sepolia Testnet</span>
            </div>
            <ConnectButton showBalance={false} />
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <SolvencyStats />
          </div>
          <div className="lg:col-span-1">
            <OperatorCard />
          </div>
          <div className="lg:col-span-1">
            <ZKCard />
          </div>
        </div>

        {/* Main Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
          {/* Left: Emergency */}
          <div className="lg:col-span-1">
            <PanicBtn />
          </div>

          {/* Right: Feed */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-6 h-full flex flex-col border border-white/5 bg-zinc-900/40">
              <TradeFeed />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex justify-between items-end border-t border-white/5 pt-8 text-zinc-600 text-xs font-mono">
          <div>
            VeriVault Pro Dashboard v1.2.0
            <br />
            Powered by SP1 & Sepolia
          </div>

          <DemoControls />
        </footer>
      </div>
    </main>
  )
}
