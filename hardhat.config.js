require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();
const {ARBITRUM_GOERLI_RPC, ARBITRUM_RPC} = require('./src/config');




module.exports = {
 solidity: "0.8.18",

 networks: {
   arbitrum: {
     url: ARBITRUM_RPC[0],
     accounts: [process.env.PRIVATE_KEY], 
   },
   arbitrumGoerli: {
     url: ARBITRUM_GOERLI_RPC[1],
     accounts: [process.env.PRIVATE_KEY], 
   },
   arbitrumFork : {
     url: `http://127.0.0.1:8545/`,
     accounts: [process.env.PRIVATE_KEY], 
   },
   sepolia : {
     url: `https://eth-sepolia.public.blastapi.io` || `https://rpc.sepolia.org`,
     accounts: [process.env.PRIVATE_KEY], 
   },
   anvil : {
     url: `http:127.0.0.1:8545`,
     accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"], 
   }
 },
 
 etherscan: {
   apiKey: process.env.ETHERSCAN_API_KEY,
 },
};