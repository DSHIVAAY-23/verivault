use super::*;
use proptest::prelude::*;

// Helper to create Fixed from f64 (or i64)
fn f(n: f64) -> Fixed {
    Fixed::from_num(n)
}

proptest! {
    // Run 1000 fuzz iterations
    #![proptest_config(ProptestConfig::with_cases(1000))]

    #[test]
    fn test_check_risk_never_panics(
        // Generates random inputs. 
        // We limit ranges slightly to avoid immediate overflow in the test setup itself 
        // (though the engine should handle limits gracefully)
        price in 0.0001f64..1_000_000.0, 
        amount in -1_000_000.0f64..1_000_000.0,
        equity in -100.0f64..10_000_000.0, 
        exposure in 0.0f64..10_000_000.0,
        max_leverage in 1.0f64..100.0,
        min_equity in 0.0f64..1_000.0,
    ) {
        let trade = Trade {
            asset: 1,
            amount: f(amount),
            price: f(price),
            side: if amount > 0.0 { TradeSide::Buy } else { TradeSide::Sell },
        };
        
        // Ensure inputs are valid for the struct logic
        let current_state = PortfolioState {
            equity: f(equity),
            total_exposure: f(exposure),
        };
        
        let params = RiskParams {
            max_leverage: f(max_leverage),
            min_equity: f(min_equity),
        };

        // The core requirement: CHECK_RISK MUST NOT PANIC
        let result = check_risk(&trade, &current_state, &params);
        
        // Invariant 1: If equity <= 0, must error
        if f(equity) <= f(0.0) {
            prop_assert_eq!(result.clone(), Err(RiskError::InsufficientEquity));
        }
        
        // Invariant 2: Result implies constraints met
        if let Ok(_new_state) = result {
             // Re-calculate checks manually
             let trade_val = trade.value();
             let expected_exposure = current_state.total_exposure + trade_val;
             let expected_leverage = expected_exposure / current_state.equity;
             
             // Assert logic consistency
             prop_assert!(expected_leverage <= params.max_leverage);
             prop_assert!(current_state.equity >= params.min_equity);
        }
    }
}
