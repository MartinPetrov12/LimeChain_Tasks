# Library

The following project is an implementation of a Library. That is a validation task from the third week of Limechain's bootcamp. 

## Overview

The task was to use the Library Contract from last week and to interact with it via ethers.js

There are 2 new files:
    - interact.ts
    - interact-sepolia.ts


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

1. Fill in your private key in the .env file

With these configurations in place, the project is set up to use Infura for deployment and testing purposes.

## Deployment
In order to deploy an instance of the contract, first it needs to be compiled:
```
npx hardhat compile
```
After that has been done, it can be deployed via the deploy task:
```
npx hardhat deploy
```

If a specific testnet is needed, it can be configured by specifying the ``--network`` parameter. For example, if one would like to deploy the contract onto Sepolia:
```
npx hardhat deploy --network sepolia
``` 
The supported test network is Sepolia.

## Interacting with the locally deployed contract 
In order to interact with the contract on a local network, first a local node needs to be set-up.

```
npx hardhat node
```

A local deployment needs to be done:
```
npx hardhat deploy --network localhost
```

After that is done, you should take the address of the contract and fill it in under ``contractAddress`` in interact.ts. Then you can should put in the private key of Account #0 (that is the default address used for contract deployments) under  ``account``.

Then, you can run the interact.ts file by:
```
ts-node interact.ts
```

## Interacting with the contract deployed on Sepolia
In order to interact with the contract on the Sepolia network, first it needs to be deployed there.

```
npx hardhat deploy --network sepolia
```

After that is done, you should take the address of the contract and fill it in under ``contractAddress`` in interact.ts. Then, you should fill in your private key in the ``.env`` file.

Finally, you can run the interact.ts file by:
```
ts-node interact.ts
```

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
