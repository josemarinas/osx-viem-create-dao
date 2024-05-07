import type { SupportedVersions } from "@aragon/osx-commons-configs";

export function getVersionTag() {
  const protocolVersion = getProtocolVersion();
  const versionTag = protocolVersion.slice(1);
  const splitVersion = versionTag.split(".");
  let build = 1
  if (splitVersion[1] ="3"){
    build = 2
  }
  return {
    release: parseInt(splitVersion[0]),
    build,
  };
}

export function getProtocolVersion() {
  const protocolVersion = process.env.PROTOCOL_VERSION as SupportedVersions;
  if (!protocolVersion) {
    throw new Error("PROTOCOL_VERSION env variable is required");
  }
  return protocolVersion;
}
