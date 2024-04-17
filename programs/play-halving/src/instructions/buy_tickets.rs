use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX, USER_STATE};
use crate::errors::ContractError;
use crate::state::{
    BetState, ProgramConfig, ProgramSettings, ProgramStatus, SecondsBetsState, UserBetsState,
};
use anchor_spl::token::Transfer;

#[event_cpi]
#[derive(Accounts)]
#[instruction(num_tickets: u8)]
pub struct BuyTickets<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(
    mut,
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = buyer
    )]
    pub buyer_ata: Account<'info, TokenAccount>,

    #[account(
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

    #[account(
    address = program_config.betting_mint
    )]
    pub betting_mint: Account<'info, Mint>,

    #[account(
    init_if_needed,
    space = UserBetsState::INIT_SPACE,
    payer = buyer,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    USER_STATE.as_bytes(),
    buyer.key().as_ref(),
    ],
    bump
    )]
    pub user_state_acc: Account<'info, UserBetsState>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    // pub clock: Sysvar<'info, Clock>, // For accessing the current blockchain timestamp
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[event]
pub struct BuyTicketsEvent {
    num_tickets: u8,
    num_free_tickets: u8,
    total_paid_tickets: u64,
    available_paid_tickets: u64,
    available_free_tickets: u64,
    total_placed_tickets: u64,
}

impl<'info> BuyTickets<'info> {
    pub fn execute(ctx: Context<Self>, num_tickets: u8) -> Result<()> {
        let program_config = &ctx.accounts.program_config;
        require!(
            program_config.status == ProgramStatus::Running,
            ContractError::BettingPaused
        );
        let buyer = &ctx.accounts.buyer.clone();
        let user_state = &mut ctx.accounts.user_state_acc;
        let mint = &ctx.accounts.betting_mint;
        let buyer_ata = &ctx.accounts.buyer_ata;
        let program_vault = &ctx.accounts.program_vault;
        let program_settings = program_config.settings;
        let tickets_price =
            num_tickets as u64 * program_settings.bet_fee * 10_u64.pow(mint.decimals as u32);

        require_gte!(
            buyer_ata.amount,
            tickets_price,
            ContractError::NotEnoughTokens
        );
        msg!("Begin transfer");

        let accounts = Transfer {
            from: buyer_ata.to_account_info(),
            to: program_vault.to_account_info(),
            authority: buyer.to_account_info(),
        };
        let context = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
        anchor_spl::token::transfer(context, tickets_price).unwrap();
        user_state.init_if_needed();
        let num_free_tickets =
            user_state.allocate_tickets_with_bonus(num_tickets, program_settings);
        msg!("user:total_paid:{}", user_state.total_paid_tickets);
        msg!("user:available_paid:{}", user_state.available_paid_tickets);
        msg!("user:available_free:{}", user_state.available_free_tickets);
        msg!("Transfer complete");
        emit!(BuyTicketsEvent {
            num_tickets,
            num_free_tickets,
            total_placed_tickets: user_state.total_placed_tickets,
            total_paid_tickets: user_state.total_paid_tickets,
            available_paid_tickets: user_state.available_paid_tickets,
            available_free_tickets: user_state.available_free_tickets,
        });
        Ok(())
    }
}
