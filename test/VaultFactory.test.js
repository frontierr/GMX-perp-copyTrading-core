

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VaultFactory0", function () {
  let vaultFactory;
  let owner;
  let user1;
  let user2;
  let vaultImplementation;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    vaultFactory = await ethers.getContractFactory("VaultFactory", owner);
    vaultImplementation = await ethers.getContractFactory("VaultImplementation", owner);
  });

  describe("constructor", function () {
    it("should set the governor to the contract deployer", async function () {
      const vf = await vaultFactory.deploy();
      expect(await vf.governor()).to.equal(owner.address);
    });
  });

  describe("setGovernor", function () {
    it("should allow the governor to be changed by the current governor", async function () {
      const vf = await vaultFactory.deploy();
      await vf.setGovernor(user1.address);
      expect(await vf.governor()).to.equal(user1.address);
    });

    it("should revert when called by a non-governor", async function () {
      const vf = await vaultFactory.deploy();
      await expect(vf.connect(user1).setGovernor(user2.address)).to.be.reverted;
    });
  });

  describe("setKeeper", function () {
    it("should allow the keeper to be changed by the current governor", async function () {
      const vf = await vaultFactory.deploy();
      await vf.setKeeper(user1.address);
      expect(await vf.keeper()).to.equal(user1.address);
    });

    it("should revert when called by a non-governor", async function () {
      const vf = await vaultFactory.deploy();
      await expect(vf.connect(user1).setKeeper(user2.address)).to.be.reverted;
    });
  });

  describe("setManagementFee", function () {
    it("should allow the management fee to be changed by the current governor", async function () {
      const vf = await vaultFactory.deploy();
      await vf.setManagementFee(500);
      expect(await vf.MANAGEMENT_FEE()).to.equal(500);
    });

    it("should revert when called by a non-governor", async function () {
      const vf = await vaultFactory.deploy();
      await expect(vf.connect(user1).setManagementFee(500)).to.be.reverted;
    });
  });

  describe("withdrawETH", function () {

    it("should revert when called by a non-governor", async function () {
      const vf = await vaultFactory.deploy();
      await expect(vf.connect(user1).withdrawETH(owner.address)).to.be.reverted;
    });
  });

  describe("withdrawTokens", function () {
    let token;
    let vf;

    beforeEach(async function () {
      vf = await vaultFactory.deploy();
      token = await (await ethers.getContractFactory("MockToken")).deploy("Mock Token", "MT", 18);
      await token.mint(owner.address, ethers.utils.parseEther("10000"))
      await token.transfer(vf.address, ethers.utils.parseEther("100"));
    });

    it("should allow the governor to withdraw tokens from the contract", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      await vf.withdrawTokens(owner.address, token.address, ethers.utils.parseEther("50"));
      const finalBalance = await token.balanceOf(owner.address);
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("50"));
    });

    it("should revert when called by a non-governor", async function () {
      await expect(vf.connect(user1).withdrawTokens(owner.address, token.address, ethers.utils.parseEther("50"))).to.be.reverted;
    });
  });

  

})



describe("VaultFactory", function () {
  let factory;
  let implementation;
  let proxy;
  let owner;
  let name = ethers.utils.formatBytes32String("Test Vault");
  let keeper;
  let MANAGEMENT_FEE = 100;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
  
    factory = await ethers.getContractFactory("VaultFactory");
    implementation = await ethers.getContractFactory("VaultImplementation");
  
    proxy =await ethers.getContractFactory("VaultProxy");
  
    implementation = await implementation.deploy();
    await implementation.connect(owner).initialize(name, keeper, factory.address, MANAGEMENT_FEE);
  
    await factory.deploy()
    await proxy.deploy(implementation.address)
    keeper = owner.address;
  });

  describe("createVault", function () {
    it("creates a new vault with the specified name", async function () {
      const  name = ethers.utils.formatBytes32String("Test Vault");
      await factory.connect(owner).createVault(name);
      const vaultName = await factory.vaults(owner.address, proxy.address);
      expect(vaultName).to.equal(name);
    });
  });

  describe("deleteVault", function () {
    it("deletes an existing vault", async function () {
      const  name = ethers.utils.formatBytes32String("Test Vault");
      await factory.connect(owner).createVault(name);
      await factory.connect(owner).deleteVault(proxy.address);
      const vaultName = await factory.vaults(owner.address, proxy.address);
      expect(vaultName).to.equal("");
    });
  });

  describe("setGovernor", function () {
    it("sets the governor address to the specified address", async function () {
      const newGovernor = ethers.Wallet.createRandom().address;
      await factory.connect(owner).setGovernor(newGovernor);
      const governor = await factory.governor();
      expect(governor).to.equal(newGovernor);
    });
  });

  describe("setKeeper", function () {
    it("sets the keeper address to the specified address", async function () {
      const newKeeper = ethers.Wallet.createRandom().address;
      await factory.connect(owner).setKeeper(newKeeper);
      const keeper = await factory.keeper();
      expect(keeper).to.equal(newKeeper);
    });
  });

  describe("setManagementFee", function () {
    it("sets the management fee to the specified amount", async function () {
      const newFee = 200;
      await factory.connect(owner).setManagementFee(newFee);
      const fee = await factory.MANAGEMENT_FEE();
      expect(fee).to.equal(newFee);
    });
  });

  describe("withdrawETH", function () {
    it("withdraws ETH from the contract", async function () {
      const balanceBefore = await owner.getBalance();
      await factory.depositETH({ value: 100 });
      await factory.connect(owner).withdrawETH(owner.address);
      const balanceAfter = await owner.getBalance();
      expect(balanceAfter).to.equal(balanceBefore.add(100));
    });
  });

  describe("withdrawTokens", function () {
    it("withdraws tokens from the contract", async function () {
      const tokenFactory = await ethers.getContractFactory("ERC20");
      const token = await tokenFactory.deploy("Test Token", "TEST", 18, 1000);
      await token.transfer(factory.address, 100);
      const balanceBefore = await token.balanceOf(owner.address);
      await factory.connect(owner).withdrawTokens(owner.address, token.address, 100);
      const balanceAfter = await token.balanceOf(owner.address);
      expect(balanceAfter).to.equal(balanceBefore.add(100));
    });
  });
});