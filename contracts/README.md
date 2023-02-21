# Game Contract and Minimal Forwarder contract

This has game Contract which stores the data related to tournaments and executes it's running conditions.
Minimal Forwarder forwards the requests with EIP2771 context to game contract
They can deployed using Hardhat.

Sample contracts are deployed to following addresses on Mumbai Testnet
```
GameContract:0x5f9dafa226283C5682379285646AdB6676DA6e64
MinimalForwarder: 0x1d8EaE0eCa3ad802908e508eae303824E7fA5e91
```

Try running some of the following tasks:

```shell
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
