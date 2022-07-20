use anchor_lang::prelude::*;
use p1::NewAccount;

declare_id!("4uVH8tbaBmsi8G9MSJggRNJwQPTf2mCcNBhdTyg2tV2N");

#[program]
pub mod p2 {
    use super::*;

    pub fn use_new_account(ctx: Context<UseNewAccount>) -> Result<()> {
        msg!("{:?}", ctx.accounts.new_account.rvalue);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UseNewAccount<'info> {
    pub new_account: Account<'info, NewAccount>
}