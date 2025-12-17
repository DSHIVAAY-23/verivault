import { create } from 'zustand'

export type TradeStatus = 'processing' | 'proving' | 'submitting' | 'verified' | 'failed'

export type Trade = {
    id: string
    user: string
    status: TradeStatus
    success: boolean
    timestamp: number
    hash?: string
    drawdown?: string
    riskScore?: string
}

type TradeStore = {
    trades: Trade[]
    addTrade: (trade: Trade) => void
    updateTrade: (id: string, updates: Partial<Trade>) => void
}

export const useTradeStore = create<TradeStore>((set) => ({
    trades: [],
    addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
    updateTrade: (id, updates) =>
        set((state) => ({
            trades: state.trades.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
}))
