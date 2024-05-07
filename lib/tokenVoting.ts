import { getNetworkDeployments } from "@aragon/osx-commons-configs";
import { getNetwork } from "./network";
import { getProtocolVersion, getVersionTag } from "./version";
import { encodeAbiParameters, encodeFunctionData, zeroAddress } from "viem";
import { TOKEN_VOTING_INSTALLATION_ABI } from "../abi";

export function encodeTokenVotingPlugin() {
  const network = getNetwork();
  const protocolVersion = getProtocolVersion();
  const versionTag = getVersionTag();
  const tokenVotingRepo =
    getNetworkDeployments(network)[protocolVersion]?.TokenVotingRepoProxy
      .address;
  if (!tokenVotingRepo) {
    throw new Error(`TokenVotingRepo address not found for network ${network}`);
  }
  const tokenVotingArgs = getTokenVotingArgs();
  const data = encodeAbiParameters(
    TOKEN_VOTING_INSTALLATION_ABI,
    tokenVotingArgs
  );
  return {
    pluginSetupRef: {
      pluginSetupRepo: tokenVotingRepo as `0x${string}`,
      versionTag,
    },
    data: data,
  };
}

function getTokenVotingArgs(): [
  {
    votingMode: number;
    supportThreshold: number;
    minParticipation: number;
    minDuration: bigint;
    minProposerVotingPower: bigint;
  },
  { token: `0x${string}`; name: string; symbol: string },
  {
    receivers: `0x${string}`[];
    amounts: bigint[];
  }
] {
  const votingModeEnv = process.env.VOTING_MODE || "0";
  const votingMode = parseInt(votingModeEnv);
  if (isNaN(votingMode)) {
    throw new Error("VOTING_MODE env variable must be a number");
  }
  const supportThresholdEnv = process.env.SUPPORT_THRESHOLD;
  if (!supportThresholdEnv) {
    throw new Error("SUPPORT_THRESHOLD env variable is required");
  }
  const supportThreshold = parseInt(supportThresholdEnv);
  if (isNaN(supportThreshold)) {
    throw new Error("SUPPORT_THRESHOLD env variable must be a number");
  }
  if (supportThreshold < 0 || supportThreshold > 1000000) {
    throw new Error("SUPPORT_THRESHOLD must be between 0 and 1000000");
  }
  const minParticipationEnv = process.env.MIN_PARTICIPATION;
  if (!minParticipationEnv) {
    throw new Error("MIN_PARTICIPATION env variable is required");
  }
  const minParticipation = parseInt(minParticipationEnv);
  if (isNaN(minParticipation)) {
    throw new Error("MIN_PARTICIPATION env variable must be a number");
  }
  const minDurationEnv = process.env.MIN_DURATION || "3600";
  const minDuration = BigInt(minDurationEnv);
  if (minDuration < 0n) {
    throw new Error("MIN_DURATION env variable must be a number");
  }
  const minProposerVotingPowerEnv =
    process.env.MIN_PROPOSER_VOTING_POWER || "0";
  const minProposerVotingPower = BigInt(minProposerVotingPowerEnv);
  if (minProposerVotingPower < 0n) {
    throw new Error("MIN_PROPOSER_VOTING_POWER env variable must be a number");
  }
  const tokenAddress = process.env.TOKEN_ADDRESS as `0x${string}`;
  if (!tokenAddress) {
    throw new Error("TOKEN_ADDRESS env variable is required");
  }
  const tokenName = process.env.TOKEN_NAME;
  if (!tokenName) {
    throw new Error("TOKEN_NAME env variable is required");
  }
  const tokenSymbol = process.env.TOKEN_SYMBOL;
  if (!tokenSymbol) {
    throw new Error("TOKEN_SYMBOL env variable is required");
  }
  let tokenReceivers: `0x${string}`[] = [];
  let tokenAmounts: string[] = [];
  if (tokenAddress === zeroAddress) {
    const tokenReceiversEnv = process.env.TOKEN_RECEIVERS;
    if (!tokenReceiversEnv) {
      throw new Error("TOKEN_RECEIVERS env variable is required");
    }
    tokenReceivers = tokenReceiversEnv.split(",") as `0x${string}`[];
    if (tokenReceivers.length === 0) {
      throw new Error("At least one address is required in TOKEN_RECEIVERS");
    }
    const tokenAmountsEnv = process.env.TOKEN_AMOUNTS;
    if (!tokenAmountsEnv) {
      throw new Error("TOKEN_AMOUNTS env variable is required");
    }
    tokenAmounts = tokenAmountsEnv.split(",");
    if (tokenAmounts.length === 0) {
      throw new Error("At least one amount is required in TOKEN_AMOUNTS");
    }
    if (tokenReceivers.length !== tokenAmounts.length) {
      throw new Error(
        "TOKEN_RECEIVERS and TOKEN_AMOUNTS must have the same length"
      );
    }
  }
  return [
    {
      votingMode,
      supportThreshold,
      minParticipation,
      minDuration,
      minProposerVotingPower,
    },
    {
      token: tokenAddress,
      name: tokenName,
      symbol: tokenSymbol,
    },
    {
      receivers: tokenReceivers,
      amounts: tokenAmounts.map((amount) => BigInt(amount)),
    },
  ];
}
