# Web3 Tournaments-app

This Application allows users to enter tournament hosted on Web3 and play with other players. Scores are stored in a Smart contract and a leaderboard is created once the torunament is completed.

1. `UI` has tournament-app written in react with Typescript which allows user to join the website using metamask and enter tournaments
2. `Contracts` has the Game Contract and Minimal Forwarder contract written in Solidity which can be deployed using hardhat through `hardhat.config.js` configaruation
3. `apis` has API-system written in TypeScript with NodeJs which provides with all the methods related to tournament and login as well as Executes transactions to blockchain
4. `livecopy` in apis has all the methods which interact with contracts
5. Each Service has a .example.env file for the overview of all the Environment variable used
