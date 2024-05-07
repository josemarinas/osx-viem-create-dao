import { SupportedNetworks } from "@aragon/osx-commons-configs";
import {
  arbitrum,
  arbitrumSepolia,
  mainnet,
  sepolia,
  type Chain,
} from "viem/chains";

export function getViemNetwork(): Chain {
  const network = getNetwork();
  switch (network) {
    case SupportedNetworks.MAINNET:
      return mainnet;
    case SupportedNetworks.SEPOLIA:
      return sepolia;
    case SupportedNetworks.ARBITRUM:
      return arbitrum;
    case SupportedNetworks.ARBITRUM_SEPOLIA:
      return arbitrumSepolia;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export function getNetwork(): SupportedNetworks {
  const network = process.env.NETWORK as SupportedNetworks;
  if (!network) {
    throw new Error("NETWORK env variable is required");
  }
  return network;
}
