const { ethers } = require('hardhat');
const {ARBITRUM_GOERLI_RPC, ARBITRUM_RPC} = require('../../src/config');

async function main() {


  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_RPC[0]);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const factoryContract = await ethers.getContractFactory('VaultFactory', wallet);
  const contract = await factoryContract.deploy();

  console.log('VaultFactory contract deployed to:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


  // npx hardhat run --network arbitrumGoerli  scripts/Gov/deployVaultFactory.js