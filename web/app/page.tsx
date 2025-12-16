import { SolvencyStats } from '@/components/dashboard/SolvencyStats'
import { TradeFeed } from '@/components/dashboard/TradeFeed'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-black text-white selection:bg-emerald-500/30">
      {/* Header */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-16">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-zinc-800 bg-black pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-zinc-900/50 lg:p-4">
          <span className="font-bold text-emerald-400 mr-2">VERIVAULT</span>
          <code className="font-mono font-bold">Proof of Solvent Execution</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-black via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-zinc-400 hover:text-white transition-colors"
            href="https://github.com/DSHIVAAY-23"
            target="_blank"
            rel="noopener noreferrer"
          >
            By DSHIVAAY-23
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative flex place-items-center mb-16 before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-emerald-400 before:to-transparent before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-indigo-500 after:to-transparent after:opacity-10 after:blur-2xl after:content-[''] z-[-1]">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 mb-4">
            The Sovereign Chain
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg">
            Monitor real-time zero-knowledge trade execution and solvency verification on the Polygon CDK testnet.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <SolvencyStats />

      {/* Feed */}
      <TradeFeed />
    </main>
  )
}
