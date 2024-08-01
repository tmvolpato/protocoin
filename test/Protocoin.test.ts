import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Protocoin Tests", function () {
  async function deployProtocoinFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Protocoin = await hre.ethers.getContractFactory("Protocoin");
    const protocoin = await Protocoin.deploy();

    return { protocoin, owner, otherAccount };
  }

  it("Should have correct name", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    const name = await protocoin.name();

    expect(name).to.equal("Protocoin");
  });

  it("Should have correct symbol", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    const symbol = await protocoin.symbol();

    expect(symbol).to.equal("PRC");
  });

  it("Should have correct decimal", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    const decimals = await protocoin.decimals();

    expect(decimals).to.equal(18);
  });

  it("Should have correct total supply", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    const totalSupply = await protocoin.totalSupply();

    expect(totalSupply).to.equal(1000n * 10n ** 18n);
  });

  it("Should get balance", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    const balance = await protocoin.balanceOf(owner.address);

    expect(balance).to.equal(1000n * 10n ** 18n);
  }); 

  it("Should transfer", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    
    const balanceOwnerBefore = await protocoin.balanceOf(owner.address);
    const balanceOtherBefore = await protocoin.balanceOf(otherAccount.address);

    await protocoin.transfer(otherAccount.address, 1n);

    const balanceOwnerAfter = await protocoin.balanceOf(owner.address);
    const balanceOtherAfter = await protocoin.balanceOf(otherAccount.address);

    expect(balanceOwnerBefore).to.equal(1000n * 10n ** 18n);
    expect(balanceOwnerAfter).to.equal((1000n * 10n ** 18n) - 1n);

    expect(balanceOtherBefore).to.equal(0);
    expect(balanceOtherAfter).to.equal(1);
  }); 

  it("Should not transfer", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    
    const instance = protocoin.connect(otherAccount);
    
    await expect(instance.transfer(owner.address, 1n)).to.be.revertedWith("Insufficient balance");
  });

  it("Should approve", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    
    await protocoin.approve(otherAccount.address, 1n);

    const value = await protocoin.allowance(owner.address, otherAccount.address);

    expect(value).to.equal(1);
  });

  it("Should transfer from", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    
    const balanceOwnerBefore = await protocoin.balanceOf(owner.address);
    const balanceOtherBefore = await protocoin.balanceOf(otherAccount.address);

    await protocoin.approve(otherAccount.address, 10n);
    
    const instance = protocoin.connect(otherAccount);
    await instance.transferFrom(owner.address, otherAccount.address, 5n);

    const balanceOwnerAfter = await protocoin.balanceOf(owner.address);
    const balanceOtherAfter = await protocoin.balanceOf(otherAccount.address);

    const allowance = await protocoin.allowance(owner.address, otherAccount.address);

    expect(balanceOwnerBefore).to.equal(1000n * 10n ** 18n);
    expect(balanceOwnerAfter).to.equal((1000n * 10n ** 18n) - 5n);
    expect(balanceOtherBefore).to.equal(0);
    expect(balanceOtherAfter).to.equal(5);
    expect(allowance).to.equal(5);
  });

  it("Should not transfer from (balance)", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    
    const instance = protocoin.connect(otherAccount);
    
    await expect(instance.transferFrom(otherAccount.address, otherAccount.address, 1n))
    .to.be.revertedWith("Insufficient balance");
  });

  it("Should not transfer from (allowance)", async function () {
    const { protocoin, owner, otherAccount } = await loadFixture(deployProtocoinFixture);
    
    const instance = protocoin.connect(otherAccount);
    
    await expect(instance.transferFrom(owner.address, otherAccount.address, 1n))
    .to.be.revertedWith("Insufficient allowance");
  });

});
