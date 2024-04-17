use anchor_lang::prelude::*;

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX};
use crate::errors::ContractError;
use crate::state::{ProgramConfig, ProgramStatus};

#[derive(Accounts)]
pub struct PauseBetting<'info> {
    #[account(mut, address = program_config.admin @ ContractError::IllegalAdminAccess)]
    pub admin: Signer<'info>,

    #[account(
    mut,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    PROGRAM_CONFIG.as_bytes()
    ],
    bump = program_config.program_config_bump,
    )]
    pub program_config: Account<'info, ProgramConfig>,
    pub system_program: Program<'info, System>,
}

impl<'info> PauseBetting<'info> {
    pub fn execute(ctx: Context<Self>) -> Result<()> {
        ctx.accounts.program_config.status = ProgramStatus::BettingPaused;
        Ok(())
    }
}
