import { HardhatUserConfig, task, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const lazyImport = async (module: any) => {
  return await import(module);
};

task("deploy", "Deploys contracts").setAction(async () => {
  const { main } = await lazyImport("./scripts/deploy-election");
  await main;
});

task("deploy-with-pk", "Deploys contract with pk")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async ({ privateKey }) => {
    const { main } = await lazyImport("./scripts/deploy-pk");
    await main(privateKey);
  });

subtask("print", "Prints a message")
    .addParam("message", "The message to print")
    .setAction(async (taskArgs) => {
      console.log(taskArgs.message);
    });

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17"
      }
    ]
  },
  networks: {
    // Goerli Testnet
    goerli: {
      url: `https://goerli.infura.io/v3/563f95d93d3946338c9098edfaa2e703`,
      chainId: 5,
      accounts: [
        `bb89ca620fe5ffee345b7c53a74885ce39ebf20095e64cee97db47b9d1dcc1b0`,
      ],
    },
  },
  etherscan: {
    apiKey: 'CHIRAADNUI814XIT9ST36R63UFNBNDKBDY'
  }
};
