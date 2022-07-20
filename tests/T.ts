import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { IDL as P1 } from "../target/types/p1";
import { IDL as P2 } from "../target/types/p2";

const P1Id = "BVE8THtWxBTG65TzfSe5UFpw8icCdJHswvvZhDWMegYV";
const P2Id = "4uVH8tbaBmsi8G9MSJggRNJwQPTf2mCcNBhdTyg2tV2N";

describe("General tests", () => {
  anchor.setProvider(
      anchor.AnchorProvider.local(undefined, {commitment: 'confirmed'})
  );
  const pP1 = new Program(P1, P1Id, anchor.getProvider());
  const pP2 = new Program(P2, P2Id, anchor.getProvider());

  it("Test that P2 can access an account initialised by P1", async () => {
      const newAccount = anchor.web3.Keypair.generate();
      const signer = anchor.web3.Keypair.generate();

      // Request money from the node to pay for the tx
      const connection = anchor.getProvider().connection;
      const txid = await connection.requestAirdrop(signer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
      await connection.confirmTransaction(txid);

      // Initialise newAccount
      const txP1 = await pP1.methods
          .initialize()
          .accounts({
            newAccount: newAccount.publicKey,
            signer: signer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
          })
          .signers([newAccount, signer])
          .rpc();
      await connection.confirmTransaction(txP1, 'confirmed');

      // Make P2 print newAccount.rvalue on its log, which proves it can access
      // the values inside the account
      const txP2 = await pP2.methods
          .useNewAccount()
          .accounts({
            newAccount: newAccount.publicKey
          })
          .rpc();
      await connection.confirmTransaction(txP2, 'confirmed');

      // Print the log from the tx executed by P2
      console.log(
          (await connection.getTransaction(txP2, { commitment: "confirmed" }))
              .meta
              .logMessages
      );
  });
});
