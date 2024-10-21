async function main() {
    const StorageSharing = await ethers.getContractFactory("StorageSharing");
    const storageSharing = await StorageSharing.deploy();
    await storageSharing.deployed();
    console.log("StorageSharing deployed to:", storageSharing.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  