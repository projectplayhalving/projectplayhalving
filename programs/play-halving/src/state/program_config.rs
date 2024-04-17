use anchor_derive_space::InitSpace;
use anchor_lang::prelude::*;
use anchor_spl::token::Transfer;

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub struct MarkedHalving {
    pub halving_timestamp: i64,
    pub marked_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub enum ProgramStatus {
    Running,
    BettingPaused,
    ClaimsOpen(MarkedHalving),
    Closed(MarkedHalving),
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub struct ProgramSettings {
    pub bet_fee: u64,
    pub grand_rewards_pool: u64,
    pub min_tickets_sold: u64,
    pub hour_return_pc: u8,
    pub minute_return_pc: u8,
    pub bets_free_bundle: u8,
    pub paid_bets_for_free_bundle: u8,
    pub claim_window_hours: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ProgramConfig {
    pub start_timestamp: i64,

    pub admin: Pubkey,
    pub betting_mint: Pubkey,
    pub program_vault: Pubkey,

    pub status: ProgramStatus,
    pub settings: ProgramSettings,

    pub total_bets_placed: u64,
    pub total_tickets_sold: u64,

    pub program_config_bump: u8,
    #[max_len(50)]
    pub winners: Vec<Pubkey>,
    pub winners_paid: u8,
}

impl ProgramConfig {
    pub fn init(
        &mut self,
        start_timestamp: i64,
        admin: Pubkey,
        betting_mint: Pubkey,
        program_vault: Pubkey,
        settings: ProgramSettings,
        program_config_bump: u8,
    ) {
        self.start_timestamp = start_timestamp;
        self.admin = admin;
        self.betting_mint = betting_mint;
        self.program_vault = program_vault;
        self.status = ProgramStatus::Running;
        self.settings = settings;
        self.total_bets_placed = 0;
        self.program_config_bump = program_config_bump;
        self.winners = Vec::new();
        self.winners_paid = 0
    }

    pub fn is_claiming_window_open(&self, now: i64) -> bool {
        match self.status {
            ProgramStatus::ClaimsOpen(marked) => {
                now <= marked.marked_at + self.settings.claim_window_hours as i64 * 60 * 60
            }
            _ => false,
        }
    }

    pub fn has_min_tickets(&self) -> bool {
        self.settings.min_tickets_sold <= self.total_tickets_sold
    }

    pub fn transfer_signed_out<'info>(
        &self,
        accounts: Transfer<'info>,
        token_program: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let authority_seeds: &[&[&[u8]]] = &[&[
            SEEDS_PREFIX.as_bytes(),
            PROGRAM_CONFIG.as_bytes(),
            &[self.program_config_bump],
        ]];
        let context = CpiContext::new(token_program, accounts).with_signer(authority_seeds);

        anchor_spl::token::transfer(context, amount)
    }
}
