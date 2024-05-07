import {
  SupportedVersions,
  getNetworkDeployments,
  type SupportedNetworks,
} from "@aragon/osx-commons-configs";
import {
  createWalletClient,
  http,
  toHex,
  zeroAddress,
  type Account,
  type PublicClient,
  type WalletClient,
} from "viem";
import { DAO_FACTORY_ABI } from "../abi";
import { encodeMultisigPlugin } from "./multisig";
import { pinMetadata, type DaoMetadata } from "./ipfs";
import { encodeTokenVotingPlugin } from "./tokenVoting";

export async function createDao(
  client: PublicClient,
  account: Account,
  network: SupportedNetworks
) {
  const protocolVersion = process.env.PROTOCOL_VERSION as SupportedVersions;
  const daoFactoryAddress =
    getNetworkDeployments(network)[protocolVersion]?.DAOFactory.address;
  if (!daoFactoryAddress) {
    throw new Error(`DAOFactory address not found for network ${network}`);
  }
  const plugins: Array<any> = [];
  const installMultisig = process.env.INSTALL_MULTISIG === "true";
  if (installMultisig) {
    const multisigPlugin = encodeMultisigPlugin();
    plugins.push(multisigPlugin);
  }
  const installTokenVoting = process.env.INSTALL_TOKEN_VOTING === "true";
  if (installTokenVoting) {
    const tokenVotingPlugin = encodeTokenVotingPlugin();
    plugins.push(tokenVotingPlugin);
  }
  if (plugins.length === 0) {
    throw new Error("No plugins specified");
  }
  const daoConfig = await getDaoConfig();
  const simulation = await client.simulateContract({
    address: daoFactoryAddress as `0x${string}`,
    abi: DAO_FACTORY_ABI,
    functionName: "createDao",
    args: [daoConfig, plugins],
    account: account,
  });
  const walletClient = createWalletClient({
    transport: http(),
    chain: client.chain,
    account,
  });
  const tx = walletClient.writeContract(simulation.request);
  return tx;
}

export async function getDaoConfig() {
  const subdomain = process.env.DAO_SUBDOMAIN as string;
  if (!subdomain) {
    throw new Error("SUBDOMAIN env variable is required");
  }
  
  const metadata: DaoMetadata = {
    name:
      (process.env.DAO_NAME as string) ||
      `Test DAO #${Math.floor(Math.random() * 1000)}`,
    description: (process.env.DAO_DESCRIPTION as string) || "Test DAO description",
    avatar: process.env.DAO_AVATAR,
    links: [],
  };

  const ipfsHash = await pinMetadata(metadata);

  return {
    trustedForwarder: (process.env.DAO_TRUSTED_FORWARDER ?? zeroAddress) as `0x${string}`,
    daoURI: process.env.DAO_URI ?? ("" as string),
    subdomain: subdomain,
    metadata: toHex(`ipfs://${ipfsHash}`),
  };
}
