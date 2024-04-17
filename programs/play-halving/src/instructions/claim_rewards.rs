use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::Transfer;
use anchor_spl::token::{Mint, Token, TokenAccount};

use program_config::MarkedHalving;

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX, USER_STATE};
use crate::errors::ContractError;
use crate::state::program_config::ProgramStatus;
use crate::state::{program_config, ProgramConfig, UserBetsState};

#[event_cpi]
#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(
    mut,
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = buyer
    )]
    pub buyer_ata: Account<'info, TokenAccount>,

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
    #[account(
    address = program_config.betting_mint
    )]
    pub betting_mint: Account<'info, Mint>,

    // #[account(
    // init_if_needed,
    // payer = buyer,
    // space = SecondsBetsState::INIT_SPACE,
    // seeds = [
    // SEEDS_PREFIX.as_bytes(),
    // SECOND_STATE.as_bytes(),
    // timestamp_to_bet.to_le_bytes().as_ref(),
    // ],
    // bump
    // )]
    // pub second_state_acc: Account<'info, SecondsBetsState>,
    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    USER_STATE.as_bytes(),
    buyer.key().as_ref(),
    ],
    bump
    )]
    pub user_state_acc: Account<'info, UserBetsState>,
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum ClaimResult {
    Winner,
    Rebate,
    Return,
}

#[event]
pub struct ClaimEvent {
    amount: u64,
    reclaim_result: ClaimResult,
    user: Pubkey,
}

impl<'info> ClaimRewards<'info> {
    pub fn execute(ctx: Context<Self>) -> Result<()> {
        let clock = Clock::get().unwrap();
        let program_config = &mut ctx.accounts.program_config;
        let settings = program_config.settings;
        let buyer = &ctx.accounts.buyer;
        let program_vault = &mut ctx.accounts.program_vault;
        let buyer_ata = &ctx.accounts.buyer_ata;
        let mint = &ctx.accounts.betting_mint;
        let e_decimals = 10_u64.pow(mint.decimals as u32);
        let ticket_price = settings.bet_fee * e_decimals;

        let transfer_acc_infos = Transfer {
            from: program_vault.to_account_info(),
            to: buyer_ata.to_account_info(),
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
            ProgramStatus::ClaimsOpen(MarkedHalving {
                halving_timestamp,
                marked_at: _,
            }) => {
                require!(
                    program_config.is_claiming_window_open(clock.unix_timestamp),
                    ContractError::ClaimingWindowClosed
                );
                let user_state = &mut ctx.accounts.user_state_acc;
                // err if user has reclaimed
                require!(!user_state.has_reclaimed, ContractError::AlreadyClaimed);
                if !program_config.has_min_tickets() {
                    msg!("not enough tickets sold, returning bet");
                    // we return all bets
                    let paid_tickets = user_state.total_paid_tickets;
                    let amount = paid_tickets * ticket_price;
                    perform_transfer(amount);
                    emit!(ClaimEvent {
                        amount,
                        reclaim_result: ClaimResult::Return,
                        user: buyer.key(),
                    });
                } else {
                    let per_winner = settings.grand_rewards_pool
                        / program_config.winners.len() as u64
                        * e_decimals;
                    if program_config.winners.contains(buyer.key) {
                        msg!("found big winner");
                        let amount = per_winner;
                        perform_transfer(amount);
                        program_config.winners_paid += 1;
                        emit!(ClaimEvent {
                            amount,
                            reclaim_result: ClaimResult::Winner,
                            user: buyer.key(),
                        });
                    } else {
                        // we pay back bets matching minutes and hours
                        let rebates_total = user_state.get_rebates_amount(
                            program_config.settings,
                            halving_timestamp,
                            ticket_price,
                        );
                        let winners_left_to_pay =
                            program_config.winners.len() as u8 - program_config.winners_paid;
                        let min_amount = winners_left_to_pay as u64 * per_winner;
                        let amount = if program_vault.amount - rebates_total >= min_amount {
                            rebates_total
                        } else {
                            program_vault.amount - min_amount
                        };
                        perform_transfer(amount);
                        emit!(ClaimEvent {
                            amount,
                            reclaim_result: ClaimResult::Rebate,
                            user: buyer.key(),
                        });
                    }
                }
                user_state.has_reclaimed = true;
                Ok(())
            }
            _ => Err(ContractError::NotDone.into()),
        }
    }
}
