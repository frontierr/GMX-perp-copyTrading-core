## to learn more on UUPS
- https://github.com/nuthan2x/uups-feb23

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```


## steps

- clone the repo to the local folder
```
npm init -y
```
```
npm i
```

then fork Arbitrum locally to deploy/ interact with contract.

```
npx hardhat node --fork https://rpc.ankr.com/arbitrum
```


then see forkArbitrum.md for more details on fork node data or see in command line 
or fork with anvil.

```
anvil --fork-url https://rpc.ankr.com/arbitrum
```

