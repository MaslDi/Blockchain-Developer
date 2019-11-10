
## Deploy contract on Rinkeby-Testnet

Requirements:

Load address with Test-Ether on Rinkeby-Testnet in Metamask

1) Verify you have the Truffle (v5.0.2) latest installed if not use the command ```npm install -g truffle```

Versions in this example:
- Truffle v5.0.43 
- Node v10.16.3

2) Use ```mkdir SampleToken``` to create a directory

3) ```cd SampleToken```

4) Run the command: ```truffle init``` to initialize a truffle project.

5) Run ```npm install --save truffle-hdwallet-provider``` used to set up the provider to connect to the Infura Node

6) Run ```npm install openzeppelin-solidity```

7) Update ```truffle-config.js``` and ```migrations/initial_migration.js```

8) Command to deploy to Rinkeby using truffle ```truffle migrate --reset --network rinkeby```

9) Import contract address into Metamask to ADD Tokens

10) Transfer Token to other address

https://rinkeby.etherscan.io/token/0xd622352242da4d458989d9a7343613bf24c276ab
