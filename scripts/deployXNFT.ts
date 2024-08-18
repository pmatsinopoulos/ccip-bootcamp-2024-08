import { ethers, network } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import path from "path";
import fs from "fs/promises";
import writeContractAddressToFile from "../utils/writeContractAddressToFile";

const CONTRACT_NAME = "XNFT";

async function main() {
  console.log(`Deploying contract ${CONTRACT_NAME}`);

  const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const networkConfig = network.config as CustomNetworkConfig;

  const contract = await ContractFactory.deploy(
    networkConfig.routerAddress,
    networkConfig.linkTokenAddress,
    networkConfig.ccipChainSelector
  );

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.debug(
    `Chain: ${networkConfig.name}, ${CONTRACT_NAME} deployed address ${contractAddress}`
  );

  writeContractAddressToFile(
    networkConfig.name,
    CONTRACT_NAME,
    contractAddress
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
