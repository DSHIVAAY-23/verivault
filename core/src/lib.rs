#![no_std]

use serde::{Deserialize, Serialize};
use fixed::types::I64F64;

// Type alias for Fixed-Point arithmetic (64 integer bits, 64 fractional bits)
// Sufficient for high precision financial math.
pub type Fixed = I64F64;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Trade {
    pub asset: u64, // simplified asset ID
    pub amount: Fixed,
    pub price: Fixed, // Execution price
    pub side: TradeSide,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum TradeSide {
    Buy,
    Sell,
}

impl Trade {
    pub fn value(&self) -> Fixed {
        self.amount * self.price
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PortfolioState {
    pub equity: Fixed, // Net Asset Value
    pub total_exposure: Fixed, // Gross Notional Exposure
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskParams {
    pub max_leverage: Fixed, // e.g., 5.0
    pub min_equity: Fixed, // e.g., 100.0 (Minimum account balance)
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum RiskError {
    LeverageExceeded,
    InsufficientEquity,
    InvalidPrice,
}

/// Checks if a trade is safe to execute given the current state and risk parameters.
/// Returns the projected new state if safe, or a RiskError.
pub fn check_risk(
    trade: &Trade, 
    current_state: &PortfolioState, 
    params: &RiskParams
) -> Result<PortfolioState, RiskError> {
    
    // 1. Basic Validity
    if trade.price <= 0 {
        return Err(RiskError::InvalidPrice);
    }
    
    // 2. Projected State Calculation
    // Simplification: We assume 'equity' stays roughly same (ignoring fees/slippage for now)
    // but 'exposure' increases by the trade value.
    // In a real system, we'd handle Buy (long) vs Sell (short/reduce) logic.
    // For this MVP, we treat every trade as adding exposure (conservative bounds).
    
    let trade_val = trade.value();
    let new_exposure = current_state.total_exposure + trade_val;
    
    // 3. Leverage Check
    // Leverage = Exposure / Equity
    if current_state.equity <= 0 {
        return Err(RiskError::InsufficientEquity);
    }
    
    let current_leverage = new_exposure / current_state.equity;
    if current_leverage > params.max_leverage {
        return Err(RiskError::LeverageExceeded);
    }

    // 4. Min Equity Check
    if current_state.equity < params.min_equity {
        return Err(RiskError::InsufficientEquity);
    }

    Ok(PortfolioState {
        equity: current_state.equity,
        total_exposure: new_exposure,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use super::*;

    fn f(n: i64) -> Fixed {
        Fixed::from_num(n)
    }

    #[test]
    fn test_valid_trade() {
        let trade = Trade {
            asset: 1,
            amount: f(10),
            price: f(10), // Value = 100
            side: TradeSide::Buy,
        };
        let state = PortfolioState {
            equity: f(1000),
            total_exposure: f(0),
        };
        let params = RiskParams {
            max_leverage: f(5),
            min_equity: f(100),
        };

        let result = check_risk(&trade, &state, &params);
        assert!(result.is_ok());
        let new_state = result.unwrap();
        assert_eq!(new_state.total_exposure, f(100)); // 0 + 100
    }

    #[test]
    fn test_leverage_exceeded() {
         let trade = Trade {
            asset: 1,
            amount: f(600),
            price: f(10), // Value = 6000
            side: TradeSide::Buy,
        };
        let state = PortfolioState {
            equity: f(1000),
            total_exposure: f(0),
        };
        let params = RiskParams {
            max_leverage: f(5), // Max exp = 5000
            min_equity: f(100),
        };

        let result = check_risk(&trade, &state, &params);
        assert_eq!(result, Err(RiskError::LeverageExceeded));
    }
}

#[cfg(test)]
mod fuzz_tests;
