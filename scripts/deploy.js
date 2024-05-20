const hre= require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Crowdfundingfm = await hre.ethers.getContractFactory("Crowdfundingfms");
  const crowdfunding = await Crowdfundingfm.deploy();

  console.log("Crowdfundingfms contract deployed to:", crowdfunding.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
;