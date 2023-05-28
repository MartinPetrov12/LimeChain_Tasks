# Library

The following project is an implementation of a Library. That is a validation task from the second week of Limechain's bootcamp. 

## Overview

The task was to create a Library contract, reach 100% test coverage and to create deployment scripts. Also, a subtask has been created which prints out the block number, gas price and name of the network after a contract has been deployed.

Address of a deployed instance of the contract on Sepolia: 0xeEfD18BA75333e32887d10a17Fd35d0ffd2DDa1a

Link to the verified contract: https://sepolia.etherscan.io/address/0xeEfD18BA75333e32887d10a17Fd35d0ffd2DDa1a#code

## Prerequisites

Before getting started, make sure you have the following installed:

- Node.js
- Hardhat

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/MartinPetrov12/LimeChain_Tasks.git
   ```
2. Navigate to the project directory
    ```
    cd Week2_LibraryTask
    ```
3. Install dependencies
    ```
    npm install
    ```
## Configuration
The required configuration steps need to be taken before experimenting with the code:

1. Create accounts on Infura and Etherscan
2. Obtain an Infura API key for both Sepolia and Goerli testnets, and an Etherscan API key
3. Fill in the API keys in the .env file
4. Fill in your private key in the .env file

With these configurations in place, the project is set up to use Infura for deployment purposes and Etherscan for validation ones.

## Usage
In order to deploy an instance of the contract, first it needs to be compiled:
```
npx hardhat compile
```
After that has been done, it can be deployed via the deploy task:
```
npx hardhat deploy
```

If a specific testnet is need, it can be configured by specifying the ``--network`` parameter. For example, if one would like to deploy the contract onto Sepolia:
```
npx hardhat deploy --network sepolia
``` 
The supported test networks are Sepolia and Goerli.

## Testing

Tests can be run via:
```
npx hardhat test
```

If one would like to know the actual coverage, they should run: 
```
npx hardhat coverage
```
That is going to generate a coverage report for the tests, which could be found under ``\coverage\index.html``.
