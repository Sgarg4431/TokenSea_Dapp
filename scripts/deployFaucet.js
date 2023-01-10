// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Faucet=await ethers.getContractFactory("Faucet");
  const faucet=await Faucet.deploy("0x55CC363617B4420b68BfD4e7ddc13b2531A4fc24");
  await faucet.deployed();
  console.log("address:",faucet.address);
//0x4FA487736683547d415Dceeb22A25c762A3cccA0

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
