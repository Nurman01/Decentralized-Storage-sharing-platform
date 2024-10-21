const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StorageSharing", function () {
  it("Should register a provider and allow consumers to rent storage", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const StorageSharing = await ethers.getContractFactory("StorageSharing");
    const storageSharing = await StorageSharing.deploy();
    await storageSharing.deployed();

    await storageSharing.registerAsProvider(100);
    let providerInfo = await storageSharing.getProviderInfo(owner.address);
    expect(providerInfo[0]).to.equal(100);

    await storageSharing.connect(addr1).rentStorage(owner.address, 50, { value: ethers.utils.parseEther("1") });
    providerInfo = await storageSharing.getProviderInfo(owner.address);
    expect(providerInfo[0]).to.equal(50);
  });
});
