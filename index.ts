import { createDao, encodeTokenVotingPlugin } from "./lib";
import { getAccount, getPublicClient } from "./lib/client";
import { getNetwork } from "./lib/network";
import { parseEventLogs } from "viem";
import { DAO_REGISTRY_ABI, PLUGIN_SETUP_PROCESSOR_ABI } from "./abi";

const client = getPublicClient();
const account = getAccount();
const network = getNetwork();
const txHash = await createDao(client, account, network);
const tx = await client.waitForTransactionReceipt({ hash: txHash });
// parse dao registry and plugin setup processor logs to get the addresses of the DAO and plugins
let daoAddress;
let pluginAddresses: string[] = [];
const daoRegistryTopics = parseEventLogs({
  abi: DAO_REGISTRY_ABI,
  logs: tx.logs,
});
daoRegistryTopics.forEach((topic) => {
  if (topic.eventName === "DAORegistered") {
    daoAddress = topic.args.dao;
  }
});
const pspTopics = parseEventLogs({
  abi: PLUGIN_SETUP_PROCESSOR_ABI,
  logs: tx.logs,
});
pspTopics.forEach((topic) => {
  if (topic.eventName === "InstallationApplied") {
    pluginAddresses.push(topic.args.plugin);
  }
});

console.log("DAO address:", daoAddress);
console.log("Plugin addresses:", pluginAddresses);
