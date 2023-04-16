const { ethers } = require('hardhat');
const {ADDRESSES} = require('../../src/contracts');
const {ARBITRUM_GOERLI_RPC, ARBITRUM_RPC} = require('../../src/config');

const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_RPC[0]);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);



async function modifyTrader() {
    const contract = await ethers.getContractAt('VaultImplementation', ADDRESSES.Vault, wallet);

    // Call modifyTrader function with random input
    const trader = '0x1234567890123456789012345678901234567890';
    const inverseCopyTrade = true;
    const copySizeBPS = 5000;
    const defaultCollateral = '0x1234567890123456789012345678901234567890';
    const tx =  await contract.modifyTrader(trader, inverseCopyTrade, copySizeBPS, defaultCollateral);
    console.log(` transaction hash: ${tx.hash}`);
}

async function addTrader() {
    const contract = await ethers.getContractAt('VaultImplementation', ADDRESSES.Vault, wallet);

    // Call addTrader function with random input
    const newTrader = '0x1234567890123456789012345678901234567890';
    const newInverseCopyTrade = false;
    const newCopySizeBPS = 2500;
    const newDefaultCollateral = '0x1234567890123456789012345678901234567890';
    const tx =  await contract.addTrader(newTrader, newInverseCopyTrade, newCopySizeBPS, newDefaultCollateral);
    console.log(` transaction hash: ${tx.hash}`);
}

async function deleteTrader() {
    const contract = await ethers.getContractAt('VaultImplementation', ADDRESSES.Vault, wallet);

    // Call deleteTrader function with random input
    const trader = '0x1234567890123456789012345678901234567890';
    const tx =  await contract.deleteTrader(trader);
    console.log(` transaction hash: ${tx.hash}`);
}

async function callContract() {
    const contract = await ethers.getContractAt('VaultImplementation', ADDRESSES.Vault, wallet);

    // Call callContract function with random input
    const contractToCall = '0x1234567890123456789012345678901234567890';
    const data = '0x0123456789abcdef';
    const token = '0x1234567890123456789012345678901234567890';
    const amount = ethers.utils.parseEther('1');
    const tx =  await contract.callContract(contractToCall, data, token, amount);
    console.log(` transaction hash: ${tx.hash}`);
}

async function withDrawProfit() {
    const contract = await ethers.getContractAt('VaultImplementation', ADDRESSES.Vault, wallet);

    // Call withDrawProfit function with random input
    const profitToken = '0x1234567890123456789012345678901234567890';
    const recipient = '0x1234567890123456789012345678901234567890';
    const profitAmount = ethers.utils.parseEther('10');
    const tx =  await contract.withDrawProfit(profitToken, recipient, profitAmount);
    console.log(` transaction hash: ${tx.hash}`);
}

async function withdrawETH() {
    const contract = await ethers.getContractAt('VaultImplementation', ADDRESSES.Vault, wallet);

    // Call withdrawETH function with random input
    const ethRecipient = '0x1234567890123456789012345678901234567890';
    await contract.withdrawETH(ethRecipient);
}




addTrader()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



  //   npx hardhat run --network arbitrumGoerli  scripts/User/ownerActions.js