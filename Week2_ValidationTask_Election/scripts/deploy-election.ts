import { ethers } from "hardhat";
export async function main() {
  const Election_Factory = await ethers.getContractFactory("Election");
  const election = await Election_Factory.deploy();
  await election.deployed();
  console.log(`The Election contract is deployed to ${election.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });