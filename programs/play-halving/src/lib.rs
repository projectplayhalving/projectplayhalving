use anchor_lang::prelude::*;

use instructions::*;
use state::ProgramSettings;
mod constants;
mod errors;
mod instructions;
mod state;

declare_id!("AwhF2my6A4mmpBBSP2UAWFo4392DY6Vp6TdrP1uFPCvu");

#[program]
pub mod play_halving {

    use super::*;

    pub fn initialize(ctx: Context<InitProgram>, settings: ProgramSettings) -> Result<()> {
        InitProgram::execute(ctx, settings)
    }

    pub fn buy_tickets(ctx: Context<BuyTickets>, num_tickets: u8) -> Result<()> {
        BuyTickets::execute(ctx, num_tickets)
    }

    pub fn place_bet(ctx: Context<PlaceBet>, timestamp_to_bet: i64) -> Result<()> {
        PlaceBet::execute(ctx, timestamp_to_bet)
    }

    pub fn pause_betting(ctx: Context<PauseBetting>) -> Result<()> {
        PauseBetting::execute(ctx)
    }

    pub fn claim(ctx: Context<ClaimRewards>) -> Result<()> {
        ClaimRewards::execute(ctx)
    }

    pub fn close(ctx: Context<CloseProgram>) -> Result<()> {
        CloseProgram::execute(ctx)
    }

    pub fn mark_halving(ctx: Context<MarkHalvingTimestamp>, halving_timestamp: i64) -> Result<()> {
        MarkHalvingTimestamp::execute(ctx, halving_timestamp)
    }

    // pub fn reclaim()
}
