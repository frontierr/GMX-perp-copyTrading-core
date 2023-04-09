

import { ethers } from "hardhat";
import { expect } from "chai";
import { VaultFactory } from "../contracts/VaultFactory.sol";
import { VaultProxy } from "../contracts/VaultProxy.sol";
import { VaultImplementation } from "../contracts/VaultImplementationV1.sol";

describe("VaultFactory", function() {
  let factory;
  let owner;
  let keeper;
  let managementFee;
  let vaultName = "TestVault";
  let vaultProxy;

  beforeEach(async function() {
    [owner, keeper] = await ethers.getSigners();
    factory = await ethers.getContractFactory("VaultFactory", owner);
    managementFee = 500; // 5%

    // Create a new vault
    await factory.createVault(vaultName);
    let vaultProxyAddress = await factory.vaults(owner.address, 0);
    vaultProxy = await ethers.getContractAt("VaultProxy", vaultProxyAddress);
  });

  it("should create a new vault", async function() {
    let vaultNameInStorage = await factory.vaults(owner.address, vaultProxy.address);
    expect(vaultNameInStorage).to.equal(vaultName);
  });

  it("should delete a vault", async function() {
    await factory.deleteVault(vaultProxy.address);
    let vaultNameInStorage = await factory.vaults(owner.address, vaultProxy.address);
    expect(vaultNameInStorage).to.equal("");
  });

  it("should set the governor", async function() {
    let newGovernor = await ethers.getSigner();
    await factory.connect(owner).setGovernor(newGovernor.address);
    let governor = await factory.governor();
    expect(governor).to.equal(newGovernor.address);
  });

  it("should set the keeper", async function() {
    let newKeeper = await ethers.getSigner();
    await factory.connect(owner).setKeeper(newKeeper.address);
    let keeper = await factory.keeper();
    expect(keeper).to.equal(newKeeper.address);
  });

  it("should set the management fee", async function() {
    let newManagementFee = 1000; // 10%
    await factory.connect(owner).setManagementFee(newManagementFee);
    let managementFee = await factory.MANAGEMENT_FEE();
    expect(managementFee).to.equal(newManagementFee);
  });
});

describe("VaultProxy", function() {
  let owner;
  let keeper;
  let proxy;
  let implementation;

  beforeEach(async function() {
    [owner, keeper] = await ethers.getSigners();
    implementation = await ethers.getContractFactory("VaultImplementationV1", owner);
    proxy = await ethers.getContractAt("VaultProxy", (await implementation.deploy()).address);
  });

  it("should upgrade the implementation", async function() {
    let implementationV2 = await ethers.getContractFactory("VaultImplementationV2", owner);
    await proxy.connect(owner)._upgradeTo(implementationV2.address);
    let implementationAddress = await ethers.provider.getStorageAt(proxy.address, 0);
    expect(implementationAddress).to.equal(implementationV2.address);
  });
});

describe("VaultImplementation", function() {
  let owner;
  let keeper;
  let factory;
  let implementation;
  let managementFee;
  let trader;

  beforeEach(async function() {
    [owner, keeper, trader] = await ethers.getSigners();
    implementation = await ethers.getContractFactory("VaultImplementationV1", owner);
    factory = await implementation.deploy();
    managementFee = 500; // 5%
  });

  it("should modify a trader", async function() {
    let inverseCopyTrade = true;
    let copySizeBPS = 5000; // 50%
    let defaultCollateral = await trader.getAddress();

    await factory.modifyTrader(trader.address, inverseCopyTrade, copySizeBPS, defaultCollateral);

    let traderProps = await factory.traders(trader.address);
    expect(traderProps.inverseCopyTrade).to.equal(inverseCopyTrade);
    expect(traderProps.copySizeBPS).to.equal(copySizeBPS);
    expect(traderProps.defaultCollateral).to.equal(defaultCollateral);
  });

  it("should add a new trader", async function() {
    let inverseCopyTrade = true;
    let copySizeBPS = 5000; // 50%
    let defaultCollateral = await trader.getAddress();

    await factory.addTrader(trader.address, inverseCopyTrade, copySizeBPS, defaultCollateral);

    let traderProps = await factory.traders(trader.address);
    expect(traderProps.inverseCopyTrade).to.equal(inverseCopyTrade);
    expect(traderProps.copySizeBPS).to.equal(copySizeBPS)
    expect(traderProps.defaultCollateral).to.equal(defaultCollateral);
  });

  it("should delete a trader", async function() {
    await factory.deleteTrader(trader.address);

    let traderProps = await factory.traders(trader.address);
    expect(traderProps.inverseCopyTrade).to.equal(false);
    expect(traderProps.copySizeBPS).to.equal(0);
    expect(traderProps.defaultCollateral).to.equal(ethers.constants.AddressZero);
  });

  it("should call a contract", async function() {
    let contractToCall = await ethers.getContractFactory("MockContract");
    let mockContract = await contractToCall.deploy();
    let data = mockContract.interface.encodeFunctionData("testFunction");
    let token = ethers.constants.AddressZero;
    let amount = 0;

    await factory.callContract(mockContract.address, data, token, amount);
    let result = await mockContract.testFunctionCalled();
    expect(result).to.equal(true);
  });

  it("should withdraw tokens", async function() {
    let token = await ethers.getContractFactory("MockToken");
    let mockToken = await token.deploy(owner.address, 1000000);
    let recepient = await keeper.getAddress();
    let amount = 100;

    await mockToken.approve(factory.address, amount);
    await factory.withdrawTokens(mockToken.address, recepient, amount);

    let balance = await mockToken.balanceOf(recepient);
    expect(balance).to.equal(amount);
  });

  it("should withdraw ETH", async function() {
    let recepient = await keeper.getAddress();
    let amount = ethers.utils.parseEther("1");

    await factory.withdrawETH(recepient, { value: amount });

    let balance = await ethers.provider.getBalance(recepient);
    expect(balance).to.equal(amount);
  });

  it("should withdraw profit", async function() {
    let token = await ethers.getContractFactory("MockToken");
    let mockToken = await token.deploy(owner.address, 1000000);
    let recepient = await keeper.getAddress();
    let amount = 100;

    await mockToken.approve(factory.address, amount);
    await factory.withDrawProfit(mockToken.address, recepient, amount);

    let balance = await mockToken.balanceOf(recepient);
    let fee = amount * managementFee / 10000;
    expect(balance).to.equal(amount - fee);

    balance = await mockToken.balanceOf(factory.address);
    expect(balance).to.equal(fee);
  });
});