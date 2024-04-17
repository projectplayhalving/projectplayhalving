use anchor_lang::prelude::*;

#[error_code]
pub enum ContractError {
    #[msg("This second has been fully booked, try another bet.")]
    SecondOverPurchased,
    #[msg("This user account has been fully booked, try with another wallet.")]
    UserOverPurchased,
    #[msg("No tickets left, buy some more")]
    NoTicketsLeft,
    #[msg("Not enough tokens for purchase")]
    NotEnoughTokens,
    #[msg("Not an admin!")]
    IllegalAdminAccess,
    #[msg("Betting paused!")]
    BettingPaused,
    #[msg("Betting is not done!")]
    NotDone,
    #[msg("User has already reclaimed!")]
    AlreadyClaimed,
    #[msg("Claiming window has been closed!")]
    ClaimingWindowClosed,
    #[msg("Claiming is still open!")]
    ClaimingWindowIsStillOpen,
    #[msg("Illegal Program Status")]
    IllegalProgramStatus,
}
