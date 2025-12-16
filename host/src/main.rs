use sp1_sdk::{ProverClient, SP1Stdin};
use clap::{Parser, Subcommand};
use verivault_core::{Trade, PortfolioState, RiskParams};
use std::fs::File;
use std::io::BufReader;

/// The ELF (executable) of the guest program.
const GUEST_ELF: &[u8] = sp1_sdk::include_elf!("verivault-guest");

#[derive(Parser)]
#[command(name = "verivault")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Generate a proof for a trade input file
    Prove {
        #[arg(long, short)]
        input: String,
    },
    /// Generate sample valid trade data
    Generate {
        #[arg(long, short)]
        output: String,
    },
}

#[derive(serde::Serialize, serde::Deserialize)]
struct InputData {
    trade: Trade,
    state: PortfolioState,
    risk_params: RiskParams,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Setup tracing for logging
    sp1_sdk::utils::setup_logger();
    
    let cli = Cli::parse();

    match cli.command {
        Commands::Generate { output } => {
            println!("Generating sample inputs to: {}", output);
            let trade = Trade {
                asset: 1,
                amount: verivault_core::Fixed::from_num(100),
                price: verivault_core::Fixed::from_num(50),
                side: verivault_core::TradeSide::Buy,
            };
            let state = PortfolioState {
                equity: verivault_core::Fixed::from_num(10000),
                total_exposure: verivault_core::Fixed::from_num(0),
            };
            let risk_params = RiskParams {
                max_leverage: verivault_core::Fixed::from_num(5),
                min_equity: verivault_core::Fixed::from_num(10), // 10%
            };
            
            let data = InputData { trade, state, risk_params };
            let file = File::create(output)?;
            serde_json::to_writer_pretty(file, &data)?;
            println!("Done.");
        }
        Commands::Prove { input } => {
            println!("Reading input from: {}", input);
            
            // 1. Load Inputs from JSON
            let file = File::open(input)?;
            let reader = BufReader::new(file);
            let data: InputData = serde_json::from_reader(reader)?;

            println!("Executing Trade: {:?} at Price {}", data.trade.side, data.trade.price);

            // 2. Setup SP1 Client & inputs
            let client = ProverClient::from_env();
            let mut stdin = SP1Stdin::new();
            stdin.write(&data.trade);
            stdin.write(&data.state);
            stdin.write(&data.risk_params);

            // 3. Generate Proof
            println!("Generating proof... (this may take a while)");
            let (pk, vk) = client.setup(GUEST_ELF);
            let proof = client.prove(&pk, &stdin).run().expect("Proof generation failed");

            println!("Proof generated successfully!");

            // 4. Verify Proof locally (sanity check)
            client.verify(&proof, &vk).expect("Verification failed");
            println!("Proof verified locally.");
            
            // TODO: Save proof to file for submitting to contract
        }
    }

    Ok(())
}
