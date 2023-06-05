import { ethers } from "hardhat";

async function main() {

  const storeEtherFactory = await ethers.getContractFactory("StoreYourEther");
  const storeEtherContract = await storeEtherFactory.deploy();

  await storeEtherContract.deployed();

  console.log(
    `StoreEtherContract deployed to ${storeEtherContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
