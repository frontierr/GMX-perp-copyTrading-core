// SPDX-License-Identifier: MIT

import { ethers } from "hardhat";
import { expect } from "chai";

describe("VaultFactory", function () {
    let vaultFactory, owner, governor, keeper, implementation, proxy;

    before(async function () {
      [owner, governor, keeper] = await ethers.getSigners();
      const VaultImplementation = await ethers.getContractFactory("VaultImplementation");
      implementation = await VaultImplementation.deploy();
      const VaultProxy = await ethers.getContractFactory("VaultProxy");
      const proxyContract = await VaultProxy.deploy(implementation.address);
      proxy = await ethers.getContractAt("VaultImplementation", proxyContract.address);
      const VaultFactory = await ethers.getContractFactory("VaultFactory");
      vaultFactory = await VaultFactory.deploy();
      await vaultFactory.deployed();
    });
  
    describe("createVault", function () {
      const name = "MyVault";
  
      it("should create a new vault and initialize the implementation with the given name, keeper, and management fee", async function () {
        const tx = await vaultFactory.createVault(name);
        const receipt = await tx.wait();
  
        expect(receipt.status).to.equal(1);
        expect(receipt.events.length).to.equal(1);
        expect(receipt.events[0].event).to.equal("CreateVault");
        expect(receipt.events[0].args.creator).to.equal(owner.address);
        expect(receipt.events[0].args.name).to.equal(name);
  
        const vaultProxyName = await implementation.name();
        const vaultProxyKeeper = await implementation.keeper();
        const vaultProxyManagementFee = await implementation.MANAGEMENT_FEE();
        const vaultProxyOwner = await proxy.owner();
        const vaultProxyImplementation = await proxy.implementation();
  
        expect(vaultProxyName).to.equal(name);
        expect(vaultProxyKeeper).to.equal(keeper.address);
        expect(vaultProxyManagementFee).to.equal(0);
        expect(vaultProxyOwner).to.equal(vaultFactory.address);
        expect(vaultProxyImplementation).to.equal(implementation.address);
  
        const vaultName = await vaultFactory.vaults(owner.address, proxy.address);
        expect(vaultName).to.equal(name);
      });
    });
  
    describe("deleteVault", function () {
      const name = "MyVault";
  
      it("should delete an existing vault and return true", async function () {
        await vaultFactory.createVault(name);
        const tx = await vaultFactory.deleteVault(proxy.address);
        const receipt = await tx.wait();
  
        expect(receipt.status).to.equal(1);
        expect(receipt.events.length).to.equal(1);
        expect(receipt.events[0].event).to.equal("DeleteVault");
        expect(receipt.events[0].args.creator).to.equal(owner.address);
        expect(receipt.events[0].args.proxyAddress).to.equal(proxy.address);
  
        const vaultName = await vaultFactory.vaults(owner.address, proxy.address);
        expect(vaultName).to.equal("");
      });
  
      it("should revert if an invalid proxy address is provided", async function () {
        await expect(vaultFactory.deleteVault(ethers.constants.AddressZero)).to.be.revertedWith("VaultFactory: Invalid proxy address");
      });
    });

    describe("withdrawETH", function () {
        const amount = ethers.utils.parseEther("1");
        const recipient = "0x0000000000000000000000000000000000000000";
    
        it("should withdraw ETH from the factory contract to the specified recipient", async function () {
          await owner.sendTransaction({ to: vaultFactory.address, value: amount });
          const balanceBefore = await ethers.provider.getBalance(recipient);
          await vaultFactory.connect(governor).withdrawETH(amount, recipient);
          const balanceAfter = await ethers.provider.getBalance(recipient);
          expect(balanceAfter.sub(balanceBefore)).to.equal(amount);
        });
    
        it("should revert if non-governor tries to withdraw ETH", async function () {
          await expect(vaultFactory.connect(owner).withdrawETH(amount, recipient)).to.be.revertedWith("VaultFactory: Only governor can withdraw ETH");
        });
    });
    
    describe("withdrawTokens", function () {
        const tokenAmount = ethers.utils.parseUnits("100", 18);
        let token;

        before(async function () {
            const Token = await ethers.getContractFactory("Token");
            token = await Token.deploy();
            await token.transfer(vaultFactory.address, tokenAmount);
        });

        it("should withdraw ERC20 tokens from the factory contract to the specified recipient", async function () {
            const recipient = "0x0000000000000000000000000000000000000000";
            const balanceBefore = await token.balanceOf(recipient);
            await vaultFactory.connect(governor).withdrawTokens(token.address, tokenAmount, recipient);
            const balanceAfter = await token.balanceOf(recipient);
            expect(balanceAfter.sub(balanceBefore)).to.equal(tokenAmount);
        });

        it("should revert if non-governor tries to withdraw tokens", async function () {
            await expect(vaultFactory.connect(owner).withdrawTokens(token.address, tokenAmount, owner.address)).to.be.revertedWith("VaultFactory: Only governor can withdraw tokens");
        });

        it("should revert if trying to withdraw more tokens than available", async function () {
            await expect(vaultFactory.connect(governor).withdrawTokens(token.address, tokenAmount.add(1), owner.address)).to.be.revertedWith("VaultFactory: Insufficient tokens balance");
        });
    });
    
    describe("setGovernor", function () {
        it("should change the governor to the specified address", async function () {
          await vaultFactory.connect(governor).setGovernor(owner.address);
          const newGovernor = await vaultFactory.governor();
          expect(newGovernor).to.equal(owner.address);
        });
    
        it("should revert if non-governor tries to change the governor", async function () {
          await expect(vaultFactory.connect(owner).setGovernor(keeper.address)).to.be.revertedWith("VaultFactory: Only governor can set governor");
        });
    });

    describe("setKeeper", function () {
        it("should revert if called by a non-governor", async function () {
          const nonGovernor = await ethers.getSigner();
          await expect(
            vaultFactory.connect(nonGovernor).setKeeper(keeper.address)
          ).to.be.revertedWith("VaultFactory: caller is not the governor");
        });
    
        it("should set the keeper address", async function () {
          await vaultFactory.connect(governor).setKeeper(keeper.address);
          const keeperAddress = await vaultFactory.keeper();
          expect(keeperAddress).to.equal(keeper.address);
        });
    });
    
    describe("setManagementFee", function () {
        const newFee = 100; // 1% management fee
    
        it("should revert if called by a non-governor", async function () {
          const nonGovernor = await ethers.getSigner();
          await expect(
            vaultFactory.connect(nonGovernor).setManagementFee(newFee)
          ).to.be.revertedWith("VaultFactory: caller is not the governor");
        });
    
        it("should set the management fee", async function () {
          await vaultFactory.connect(governor).setManagementFee(newFee);
          const managementFee = await vaultFactory.managementFee();
          expect(managementFee).to.equal(newFee);
        });
    });
  

  
});