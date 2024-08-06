import { ethers, network } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import path from "path";
import fs from "fs/promises";

const CONTRACT_NAME = "ProgrammableDefensiveTokenTransfers";

async function writeToFile(
  networkName: string,
  contractName: string,
  contractAddress: string
) {
  const filePath = path.join(__dirname, `${networkName}_${contractName}.json`);
  const stringToWrite = JSON.stringify({
    contractAddress,
  });
  await fs.writeFile(filePath, stringToWrite);
}

async function main() {
  console.log(`Deploying contract ${CONTRACT_NAME}`);

  const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const networkConfig = network.config as CustomNetworkConfig;

  const contract = await ContractFactory.deploy(
    networkConfig.routerAddress,
    networkConfig.linkTokenAddress
  );

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.debug(
    `Chain: ${networkConfig.name}, ${CONTRACT_NAME} deployed address ${contractAddress}`
  );

  await writeToFile(networkConfig.name, CONTRACT_NAME, contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
