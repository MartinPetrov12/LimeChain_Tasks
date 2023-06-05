import { ethers } from "hardhat";

/**
 * Deploys the Library contract to the network. 
 * At the end, the address of the contract is printed out.
 */
export async function normalDeploy() {

  const Library_Factory = await ethers.getContractFactory("Library");
  const library = await Library_Factory.deploy({gasLimit: 30000000, gasPrice: 5000000000});

  await library.deployed();

  console.log(
    `Library deployed to ${library.address}`
  );
}

// normalDeploy().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// })
