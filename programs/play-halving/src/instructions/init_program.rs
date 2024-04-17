use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX};
use crate::state::program_config::ProgramSettings;
use crate::state::ProgramConfig;

#[derive(Accounts)]
#[instruction(settings:ProgramSettings)]
pub struct InitProgram<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
    init,
    payer = admin,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    PROGRAM_CONFIG.as_bytes()
    ],
    bump,
    space = ProgramConfig::INIT_SPACE
    )]
    pub program_config: Account<'info, ProgramConfig>,

    #[account(
    init,
    payer = admin,
    associated_token::mint = betting_mint,
    associated_token::authority = program_config
    )]
    pub program_vault: Account<'info, TokenAccount>,

    pub betting_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    // For accessing the current blockchain timestamp
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}

impl<'info> InitProgram<'info> {
    pub fn execute(ctx: Context<Self>, settings: ProgramSettings) -> Result<()> {
        let clock = Clock::get().unwrap();

        let admin = &ctx.accounts.admin;
        let program_config = &mut ctx.accounts.program_config;
        program_config.init(
            clock.unix_timestamp,
            admin.key(),
            ctx.accounts.betting_mint.key(),
            ctx.accounts.program_vault.key(),
            settings,
            ctx.bumps.program_config,
        );
        Ok(())
    }
}
