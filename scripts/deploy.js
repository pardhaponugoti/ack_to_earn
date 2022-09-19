// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const AckToEarnFactory = await hre.ethers.getContractFactory("AckToEarn");
  const ackToEarn = await AckToEarnFactory.deploy();

  await ackToEarn.deployed();

  console.log(`AckToEarn contract deployed to ${ackToEarn.address}`);

  const bidAmount = hre.ethers.utils.parseEther("1");
  // Call the function.
  let txn = await ackToEarn.sendBid(
    "Read this message",
    "0x0000000000000000000000000000000000000001",
    { value: bidAmount, gasLimit: 1000000 }
  );

  // Wait for it to be mined.
  await txn.wait();

  console.log("Sent message");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
