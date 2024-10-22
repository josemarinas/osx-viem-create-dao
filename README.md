# Create DAO script

This script allows to create a DAO in any supported network. The script is controlled via `.env` file. Bare in mind that this is a simple script and it is not intended to be used in production. 

The created DAOs should be visible in aragon subgraphs with the following query:


```graphql
{
  dao {
    id
    subdomain
  }
}
```

The subgraph is available at the following URL, remember to replace the network in the URL with the desired network.


https://subgraph.satsuma-prod.com/aragon/osx-{YOUR-NETWORK}/playground

To install dependencies:

```bash
bun install
```

To run the script:

```bash
bun create-dao
```

Environment variables are in `.env.example` file. Copy it to `.env` and fill in the values.
```bash
# Please delete all the unused variables
NETWORK= # Check SupportedNetwoks
PROTOCOL_VERSION= # Default: v1.0.0 or v1.3.0
PRIVATE_KEY= # Private key of the deployer, mandatory
PINATA_API_KEY= # Pinata API key, mandatory
DAO_SUBDOMAIN= # Subdomain of the DAO, mandatory, must be unique
DAO_URI= # URI of the DAO, optional, Default: ""
DAO_TRUSTED_FORWARDER= # Trusted forwarder, optional, Default: address(0)
##### METADATA #####
DAO_NAME= # DAO name, optional, Default: "Test DAO #{Random Number}"
DAO_DESCRIPTION= # DAO description, optional, Default: "Test DAO description"
DAO_AVATAR= # DAO avatar, optional, Default: ""

##### PLUGINS #####
# One of them must be true
INSTALL_MULTISIG=
INSTALL_TOKEN_VOTING=


##### MULTISIG #####
MULTISIG_ADDRESSES= # Multisig addresses, comma separated, mandatory
MULTISIG_MIN_APPROVALS= # Minimum approvals, optional, Default: ceil(Addresses.length)
MULTISIG_ONLY_LISTED= # Only listed addresses can approve, optional, Default: false


##### TOKEN VOTING #####
# Standard = 0
# EarlyExecution = 1
# VoteReplacement = 2
VOTING_MODE=0 # Default: 0
# 0 => 0%
# 500000 => 50%
# 1000000 => 100%
SUPPORT_THRESHOLD= # between 0 and 1000000
MIN_PARTICIPATION= # Minimim token held to be able to vote
MIN_DURATION= # in seconds, minimum is 3600, default is 3600
MIN_PROPOSER_VOTING_POWER= # Minimum voting power to create a proposal
TOKEN_ADDRESS= # Token address, zero address for new token
TOKEN_NAME= # Token name of the new token if it is created or wrapped
TOKEN_SYMBOL= # Token symbol if the token is created or wrapped
TOKEN_RECEIVERS= # Token receivers comma separated, address1,address2,address3
TOKEN_AMOUNTS= # Token amounts comma separated, amount1,amount2,amount3
```
