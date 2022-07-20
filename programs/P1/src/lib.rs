use anchor_lang::prelude::*;

declare_id!("BVE8THtWxBTG65TzfSe5UFpw8icCdJHswvvZhDWMegYV");

#[program]
pub mod p1 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let new_account = &mut ctx.accounts.new_account;

        new_account.rvalue = 1337;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = 8 + std::mem::size_of::<NewAccount>())]
    pub new_account: Account<'info, NewAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    pub rvalue: u64
}
