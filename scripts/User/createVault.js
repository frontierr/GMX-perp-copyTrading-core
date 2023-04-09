const { ethers } = require('hardhat');
const {ARBITRUM_GOERLI_RPC, ARBITRUM_RPC} = require('../../src/config');
const {ADDRESSES} = require('../../src/contracts');


const VAULT_NAME = 'rambo001'; 

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_RPC[0]);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
    const vaultFactory = await ethers.getContractAt('VaultFactory', ADDRESSES.VaultFactory, wallet);
  
    const tx = await vaultFactory.createVault(ethers.utils.formatBytes32String(VAULT_NAME));
    console.log(`createVault transaction hash: ${tx.hash}`);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});