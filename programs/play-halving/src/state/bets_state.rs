use anchor_derive_space::InitSpace;
use anchor_lang::prelude::*;

use crate::errors::ContractError;
use crate::state::ProgramSettings;

pub trait BetState<T: Default + Copy> {
    fn init_if_needed(&mut self);
    fn add_bet(&mut self, bet: T) -> anchor_lang::Result<()>;
}

// Pubkeys of users that placed bets
// on this second address
// in chronological order
// #[account(zero_copy)]
// #[derive(AnchorSerialize, AnchorDeserialize,InitSpace)]
#[account]
#[derive(InitSpace)]
pub struct SecondsBetsState {
    pub initialized: bool,
    // 30k max bets per program address * 32 bytes = 96kb,
    #[max_len(40)]
    pub users: Vec<Pubkey>, // 30k max bets per program address * 32 bytes = 96kb
}

impl SecondsBetsState {
    pub fn get_winners(&self) -> Option<Vec<Pubkey>> {
        let winners: Vec<Pubkey> = self
            .users
            .iter()
            .cloned()
            .filter(|u| *u != Pubkey::default())
            .collect();
        if winners.len() > 0 {
            Some(winners)
        } else {
            None
        }
    }
}

impl BetState<Pubkey> for SecondsBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.users = Vec::new();
            self.initialized = true;
        }
    }

    fn add_bet(&mut self, bet_user: Pubkey) -> Result<()> {
        for i in 0..self.users.len() {
            if self.users[i] == Pubkey::default() {
                self.users[i] = bet_user;
            }
        }
        return Ok(());
        // Err(ContractError::SecondOverPurchased.into())
    }
}

#[account]
#[derive(InitSpace)]
pub struct UserBetsState {
    pub initialized: bool,
    pub has_reclaimed: bool,
    pub total_paid_tickets: u64,
    pub available_paid_tickets: u64,
    pub available_free_tickets: u64,
    pub total_placed_tickets: u64,
    #[max_len(900)]
    pub placed_bet_seconds: Vec<i64>,
}

impl UserBetsState {
    pub fn allocate_tickets_with_bonus(
        &mut self,
        num_tickets: u8,
        settings: ProgramSettings,
    ) -> u8 {
        let mut extra_free_tickets = 0;
        for _ in 0..num_tickets {
            self.total_paid_tickets += 1;
            self.available_paid_tickets += 1;
            if self.total_paid_tickets % settings.paid_bets_for_free_bundle as u64 == 0 {
                extra_free_tickets += settings.bets_free_bundle;
            }
        }

        self.available_free_tickets += extra_free_tickets as u64;
        extra_free_tickets
    }
    pub fn get_rebates_amount(
        &self,
        settings: ProgramSettings,
        halving_timestamp: i64,
        ticket_price: u64,
    ) -> u64 {
        let one_minute = 60; //sec
        let one_hour = one_minute * 60;
        let mut amount = 0;
        let bets = &self.placed_bet_seconds;
        let bets_paid = self.total_paid_tickets;
        for (i, bet) in bets.iter().enumerate() {
            if i as u64 >= bets_paid {
                break;
            }
            let diff = (halving_timestamp - bet).abs();
            if diff < one_minute {
                amount += ticket_price * (settings.minute_return_pc / 100) as u64
            } else if diff < one_hour {
                amount += ticket_price * (settings.hour_return_pc / 100) as u64
            }
        }
        amount
    }
}

impl BetState<i64> for UserBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.placed_bet_seconds = Vec::new();
            self.available_free_tickets = 0;
            self.available_paid_tickets = 0;
            self.total_paid_tickets = 0;
            self.total_placed_tickets = 0;
            self.initialized = true;
            self.has_reclaimed = false;
        }
    }

    fn add_bet(&mut self, bet_second: i64) -> anchor_lang::Result<()> {
        require!(
            self.placed_bet_seconds.len() < 900,
            ContractError::UserOverPurchased
        );
        let has_tickets_left: bool =
            self.available_paid_tickets > 0 || self.available_free_tickets > 0;
        require!(has_tickets_left, ContractError::NoTicketsLeft);
        if self.available_free_tickets > 0 {
            self.available_free_tickets -= 1;
        } else if self.available_paid_tickets > 0 {
            self.available_paid_tickets -= 1;
        } else {
            return Err(ContractError::NoTicketsLeft.into());
        }
        self.placed_bet_seconds.push(bet_second);
        self.total_placed_tickets += 1;
        Ok(())
    }
}
