import { ethers } from "hardhat";
export async function main(_privateKey: any) {
  console.log(_privateKey);
  const wallet = new ethers.Wallet(_privateKey, ethers.provider); // New wallet with the privateKey passed from CLI as param
  console.log("Deploying contracts with the account:", wallet.address); // We are printing the address of the deployer
  const Election_Factory = await ethers.getContractFactory("Election");
  const election = await Election_Factory.connect(wallet).deploy();
  await election.deployed();
  console.log(`The Election contract is deployed to ${election.address}`);
  const owner = await election.owner();
  console.log(`The Election contract owner is ${owner}`);
}