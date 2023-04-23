const { ethers } = require('hardhat');
const {ADDRESSES} = require('../../src/contracts');
const {ARBITRUM_GOERLI_RPC, ARBITRUM_RPC} = require('../../src/config');

const NEW_GOVERNOR = ''; 
const NEW_KEEPER = '0xD5fba05dE4b2d303D03052e8aFbF31a767Bd908e'; 
const NEW_MANAGEMENT_FEE = 1000;

async function main() {


  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_RPC[0]);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const vaultFactory = await ethers.getContractAt('VaultFactory', ADDRESSES.VaultFactory, wallet);

//   const tx1 = await vaultFactory.setGovernor(GOVERNOR_ADDR);
//   console.log(`setGovernor transaction hash: ${tx1.hash}`);

  const tx2 = await vaultFactory.setKeeper(NEW_KEEPER);
  console.log(`setKeeper transaction hash: ${tx2.hash}`);

  const tx3 = await vaultFactory.setManagementFee(NEW_MANAGEMENT_FEE);
  console.log(`setManagementFee transaction hash: ${tx3.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


    // npx hardhat run --network arbitrumGoerli  scripts/Gov/setVaultFactoryParams.js