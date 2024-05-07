import { getNetworkDeployments } from "@aragon/osx-commons-configs";
import { getNetwork } from "./network";
import { getProtocolVersion, getVersionTag } from "./version";
import { encodeAbiParameters } from "viem";
import { MULTISIG_INSTALLATION_ABI } from "../abi";

export function encodeMultisigPlugin() {
  const network = getNetwork();
  const protocolVersion = getProtocolVersion();
  const versionTag = getVersionTag();
  const multisigRepo =
    getNetworkDeployments(network)[protocolVersion]?.MultisigRepoProxy.address;
  if (!multisigRepo) {
    throw new Error(`MultisigRepo address not found for network ${network}`);
  }
  const multisigArgs = getMultisigArgs();

  const data = encodeAbiParameters(MULTISIG_INSTALLATION_ABI, multisigArgs);
  const ret = {
    pluginSetupRef: {
      pluginSetupRepo: multisigRepo as `0x${string}`,
      versionTag,
    },
    data: data,
  };
  return ret;
}

function getMultisigArgs(): [
  `0x${string}`[],
  { onlyListed: boolean; minApprovals: number }
] {
  const joinMembers = process.env.MULTISIG_ADDRESSES;
  if (!joinMembers) {
    throw new Error("MULTISIG_ADDRESSES env variable is required");
  }
  const members = joinMembers.trim().split(",") as `0x${string}`[];
  if (members.length === 0) {
    throw new Error("At least one address is required in MULTISIG_ADDRESSES");
  }
  let minApprovals = Math.ceil(members.length / 2);
  const minApprovalsEnv = process.env.MULTISIG_MIN_APPROVALS;
  if (minApprovalsEnv) {
    minApprovals = parseInt(minApprovalsEnv);
  }
  if (isNaN(minApprovals)) {
    throw new Error("MULTISIG_MIN_APPROVALS env variable must be a number");
  }
  const onlyListed = process.env.MULTISIG_ONLY_LISTED === "true";
  const ret = [members, { onlyListed, minApprovals }];
  return [members, { onlyListed, minApprovals }]; 
}
