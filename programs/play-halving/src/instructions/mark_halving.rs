use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::TokenAccount;

use crate::constants::seeds::{PROGRAM_CONFIG, SECOND_STATE, SEEDS_PREFIX};
use crate::errors::ContractError;
use crate::state::{BetState, MarkedHalving, ProgramConfig, ProgramStatus, SecondsBetsState};

#[derive(Accounts)]
#[instruction(halving_timestamp: i64)]
pub struct MarkHalvingTimestamp<'info> {
    #[account(mut, address = program_config.admin @ ContractError::IllegalAdminAccess)]
    pub admin: Signer<'info>,

    #[account(
    init_if_needed,
    payer = admin,
    space = SecondsBetsState::INIT_SPACE,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    SECOND_STATE.as_bytes(),
    halving_timestamp.to_le_bytes().as_ref(),
    ],
    bump
    )]
    pub second_state_acc: Account<'info, SecondsBetsState>,

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
        mut,
        associated_token::mint = program_config.betting_mint,
        associated_token::authority = program_config
        )]
    pub program_vault: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
}

impl<'info> MarkHalvingTimestamp<'info> {
    pub fn execute(ctx: Context<Self>, halving_timestamp: i64) -> Result<()> {
        let clock = Clock::get().unwrap();
        let program_config = &mut ctx.accounts.program_config;
        let settings = program_config.settings;
        let second_state_acc = &mut ctx.accounts.second_state_acc;
        second_state_acc.init_if_needed();
        let program_vault = &mut ctx.accounts.program_vault;

        if let Some(winners) = second_state_acc.get_winners() {
            if program_vault.amount >= settings.grand_rewards_pool {
                program_config.winners = winners
            }
        }
        program_config.status = ProgramStatus::ClaimsOpen(MarkedHalving {
            halving_timestamp,
            marked_at: clock.unix_timestamp.clone(),
        });
        Ok(())
    }
}
