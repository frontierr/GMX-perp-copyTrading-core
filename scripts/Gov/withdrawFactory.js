const { ethers } = require('hardhat');
const {ARBITRUM_GOERLI_RPC, ARBITRUM_RPC} = require('../../src/config');
const {ADDRESSES} = require('../../src/contracts');



const RECIPIENT_ADDR = ''; 
const TOKEN_ADDR = ''; 
const TOKEN_AMOUNT = ethers.utils.parseUnits('1000', 18); 

async function main() {

  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_RPC[0]);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const vaultFactory = await ethers.getContractAt('VaultFactory', ADDRESSES.VaultFactory, wallet);

  const tx1 = await vaultFactory.withdrawETH(wallet.address);
  console.log(`withdrawETH transaction hash: ${tx1.hash}`);

  const tx2 = await vaultFactory.withdrawTokens(wallet.address, TOKEN_ADDR, TOKEN_AMOUNT);
  console.log(`withdrawTokens transaction hash: ${tx2.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });