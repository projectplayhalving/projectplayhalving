use anchor_lang::prelude::*;

use crate::constants::seeds::{PROGRAM_CONFIG, SECOND_STATE, SEEDS_PREFIX, USER_STATE};
use crate::errors::ContractError;
use crate::state::program_config::ProgramStatus;
use crate::state::{BetState, ProgramConfig, SecondsBetsState, UserBetsState};

#[event_cpi]
#[derive(Accounts)]
#[instruction(timestamp_to_bet: i64)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
    mut,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    PROGRAM_CONFIG.as_bytes()
    ],
    bump = program_config.program_config_bump,
    )]
    pub program_config: Account<'info, ProgramConfig>,

    #[account(
    init_if_needed,
    payer = buyer,
    space = SecondsBetsState::INIT_SPACE,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    SECOND_STATE.as_bytes(),
    &timestamp_to_bet.to_le_bytes(),
    ],
    bump
    )]
    pub second_state_acc: Account<'info, SecondsBetsState>,

    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    USER_STATE.as_bytes(),
    buyer.key().as_ref(),
    ],
    bump
    )]
    pub user_state_acc: Account<'info, UserBetsState>,

    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[event]
pub struct PlaceBetEvent {
    timestamp_to_bet: i64,
    event_timestamp: i64,
    buyer: Pubkey,
    total_paid_tickets: u64,
    available_paid_tickets: u64,
    available_free_tickets: u64,
    total_placed_tickets: u64,
}
impl<'info> PlaceBet<'info> {
    pub fn execute(ctx: Context<Self>, timestamp_to_bet: i64) -> Result<()> {
        let clock = Clock::get().unwrap();
        let buyer = &ctx.accounts.buyer;
        let program_config = &mut ctx.accounts.program_config;
        require!(
            program_config.status == ProgramStatus::Running,
            ContractError::BettingPaused
        );
        let user_state = &mut ctx.accounts.user_state_acc;
        let second_state = &mut ctx.accounts.second_state_acc;
        user_state.add_bet(timestamp_to_bet).unwrap();
        second_state.add_bet(buyer.key()).unwrap();
        program_config.total_bets_placed += 1;
        emit!(PlaceBetEvent {
            timestamp_to_bet,
            event_timestamp: clock.unix_timestamp,
            buyer: buyer.key(),
            total_placed_tickets: user_state.total_placed_tickets,
            total_paid_tickets: user_state.total_paid_tickets,
            available_paid_tickets: user_state.available_paid_tickets,
            available_free_tickets: user_state.available_free_tickets,
        });
        Ok(())
    }
}
