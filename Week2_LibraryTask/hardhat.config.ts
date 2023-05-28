require("dotenv").config();
import { HardhatUserConfig, task, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY || '']
    },
    goerli: {
      url: process.env.INFURA_GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY || '']
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API
  }
};

const importDeploymentScript = async (module: any) => {
  return await import(module);
};

task("deploy", "Deploys Library contract").setAction(async (taskArgs, hre) => {
  const { normalDeploy } = await importDeploymentScript("./scripts/deploy-library");
  await normalDeploy();
  await hre.run("print-info");
});

subtask("print-info", "Prints valuable info after deployment").setAction(async (taskArgs, hre) => {
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  const currentNetwork = (await hre.ethers.provider.getNetwork()).name;
  const gasPrice = await hre.ethers.provider.getGasPrice();

  console.log("Block number: " + blockNumber);
  console.log("Network: " + currentNetwork);
  console.log("Current gas price: " + gasPrice);
})

export default config;
