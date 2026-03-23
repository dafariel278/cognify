"use server";
import { Contract, CotiNetwork, getDefaultProvider, Wallet } from "@coti-io/coti-ethers";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint64",  name: "amount",  type: "uint64" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export async function mintBadgeReward(
  userAddress: string,
  rewardCOG: number,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return { success: false, error: "Invalid wallet address" };
    }
    if (!process.env.COTI_MINTER_PRIVATE_KEY || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      return { success: false, error: "Server misconfigured — check environment variables" };
    }
    const provider  = getDefaultProvider(CotiNetwork.Testnet);
    const wallet    = new Wallet(process.env.COTI_MINTER_PRIVATE_KEY, provider);
    const contract  = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, ABI, wallet);
    const amount    = Math.floor(rewardCOG * 10 ** 6);
    const tx        = await contract.mint(userAddress, amount, { gasLimit: 12_000_000 });
    const receipt   = await tx.wait();
    return { success: true, txHash: receipt.hash };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
