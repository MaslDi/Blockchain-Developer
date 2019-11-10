
Project V

## Deploy StarNotary contract on Rinkeby-Testnet

Requirements:

Load address with Test-Ether on Rinkeby-Testnet in Metamask

1) Verify you have the Truffle (v5.0.2) latest installed if not use the command ```npm install -g truffle```

Versions in this example:
- Truffle v5.0.43 
- Node v10.16.3

2) Run the command: ```truffle init``` to initialize a truffle project.

3) Run ```npm install --save truffle-hdwallet-provider``` used to set up the provider to connect to the Infura Node

4) Run ```npm install openzeppelin-solidity```

5) Update ```truffle-config.js```

6) Command to deploy to Rinkeby using truffle ```truffle migrate --reset --network rinkeby```

7) Import contract address into Metamask to ADD Tokens

10) Transfer Token to other address

https://rinkeby.etherscan.io/address/0x41c985998c83c692a8eac48b107282e498e05f88


For starting the development console, run:

```truffle develop```

For compiling the contract, inside the development console, run:

```compile```

For migrating the contract to the locally running Ethereum network, inside the development console, run:

```migrate --reset```

For running unit tests the contract, inside the development console, run:

```test```

For running the Front End of the DAPP, open another terminal window and go inside the project directory, and run:

```cd app```

```npm run dev```

http://localhost:8080/


