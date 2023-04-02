require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();


const RPC = [
  "https://arb-mainnet.g.alchemy.com/v2/demo",
  "https://endpoints.omniatech.io/v1/arbitrum/one/public",
  "https://arbitrum.blockpi.network/v1/rpc/public",
  "https://arbitrum-one.public.blastapi.io",
  "https://rpc.ankr.com/arbitrum",
  "https://arb1.arbitrum.io/rpc",
  "https://1rpc.io/arb",
  `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
]

module.exports = {
 solidity: "0.8.18",

 networks: {
   arbitrum: {
     url: `https://rpc.ankr.com/eth_goerli`,
     accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"], // account 0 fork
    //  accounts: [process.env.PRIVATE_KEY],
   },
   arbitrumFork : {
     url: `http://127.0.0.1:8545/`,
     accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"], // account 0 fork
   },
   sepolia : {
     url: `https://eth-sepolia.public.blastapi.io` || `https://rpc.sepolia.org`,
     accounts: [process.env.PRIVATE_KEY], 
   }
 },
 
 etherscan: {
   apiKey: process.env.ETHERSCAN_API_KEY,
 },
};