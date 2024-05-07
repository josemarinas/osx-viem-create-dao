import {
  createPublicClient,
  http,
  type Account,
  type PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getViemNetwork } from "./network";

export function getPublicClient(): PublicClient {
  const network = getViemNetwork();
  return createPublicClient({
    transport: http(),
    chain: network,
  });
}

export function getAccount(): Account {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY env variable is required");
  }
  return privateKeyToAccount(privateKey);
}
