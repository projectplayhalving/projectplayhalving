use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX};
use crate::errors::ContractError;
use crate::state::{ProgramConfig, ProgramStatus};

#[derive(Accounts)]
pub struct CloseProgram<'info> {
    #[account(mut, address = program_config.admin @ ContractError::IllegalAdminAccess)]
    pub admin: Signer<'info>,
    #[account(
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = admin
    )]
    pub admin_ata: Account<'info, TokenAccount>,
    #[account(
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = program_config
    )]
    pub program_vault: Account<'info, TokenAccount>,
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
    address = program_config.betting_mint
    )]
    pub betting_mint: Account<'info, Mint>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CloseProgram<'info> {
    pub fn execute(ctx: Context<CloseProgram>) -> Result<()> {
        let clock = Clock::get().unwrap();
        let program_config = &mut ctx.accounts.program_config;
        let program_vault = &mut ctx.accounts.program_vault;
        let admin_ata = &ctx.accounts.admin_ata;
        let mint = &ctx.accounts.betting_mint;
        let e_decimals = 10_u64.pow(mint.decimals as u32);
        let transfer_acc_infos = Transfer {
            from: program_vault.to_account_info(),
            to: admin_ata.to_account_info(),
            authority: program_config.to_account_info(),
        };
        let perform_transfer = |amount: u64| {
            if amount > 0 {
                msg!("transferring {} to buyer", amount / e_decimals);
                program_config
                    .transfer_signed_out(
                        transfer_acc_infos,
                        ctx.accounts.token_program.to_account_info(),
                        amount,
                    )
                    .unwrap()
            }
        };
        match program_config.status {
            ProgramStatus::ClaimsOpen(marked_halving) => {
                require!(
                    program_config.is_claiming_window_open(clock.unix_timestamp),
                    ContractError::ClaimingWindowIsStillOpen
                );

                perform_transfer(program_vault.amount);
                program_config.status = ProgramStatus::Closed(marked_halving);
                // program_config.save(ctx.accounts.program_config)?;
            }
            _ => return Err(ContractError::IllegalProgramStatus.into()),
        }

        // ctx.accounts.program_config.status = ProgramStatus::BettingPaused;
        Ok(())
    }
}
