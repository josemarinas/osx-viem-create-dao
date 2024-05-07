export const MULTISIG_INSTALLATION_ABI = [
  {
    internalType: "address[]",
    name: "members",
    type: "address[]",
    description: "The addresses of the initial members to be added.",
  },
  {
    components: [
      {
        internalType: "bool",
        name: "onlyListed",
        type: "bool",
        description:
          "Whether only listed addresses can create a proposal or not.",
      },
      {
        internalType: "uint16",
        name: "minApprovals",
        type: "uint16",
        description:
          "The minimal number of approvals required for a proposal to pass.",
      },
    ],
    internalType: "struct Multisig.MultisigSettings",
    name: "multisigSettings",
    type: "tuple",
    description: "The inital multisig settings.",
  },
] as const;
