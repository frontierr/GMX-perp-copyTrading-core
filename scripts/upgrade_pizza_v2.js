const { ethers, upgrades } = require("hardhat");

const PROXY = "0x647F2ff2Df44E5b9904405b0B24B7c09118cd6Bc";

async function main() {
 const PizzaV2 = await ethers.getContractFactory("PizzaV2");
 console.log("Upgrading Pizza...");
 await upgrades.upgradeProxy(PROXY, PizzaV2);
 console.log("Pizza upgraded successfully");

 console.log("upgraded to", await upgrades.erc1967.getImplementationAddress(PROXY))
}

main();