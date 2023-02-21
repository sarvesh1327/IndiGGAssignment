// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const MinimalForwarder = await hre.ethers.getContractFactory("MinimalForwarder");
  const forwarder = await MinimalForwarder.deploy();
  const forwarderAddress = forwarder.address;
  const GameContract = await hre.ethers.getContractFactory("GameContract");
  const game = await GameContract.deploy(3, forwarderAddress);

  await game.deployed();

  console.log(
    `Deployed gamecontract to adress ${game.address} with minimal forwarder ${forwarder.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
