import hre, { ethers } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import readContractAddress from "../utils/readContractAddress";
import { ProgrammableDefensiveTokenTransfers } from "../typechain-types";

const CONTRACT_NAME = "ProgrammableDefensiveTokenTransfers";

async function main() {
  console.log("Starting...");

  // need to read the contract address in the Base Sepolia
  const currentNetworkName = (hre.network.config as CustomNetworkConfig).name;

  console.debug("Current network", currentNetworkName);

  const contractAddress = readContractAddress(
    currentNetworkName,
    CONTRACT_NAME
  );

  console.debug(
    "Contract address in",
    currentNetworkName,
    "is",
    contractAddress
  );

  const provider = new ethers.JsonRpcProvider(hre.network.config.url);

  const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);

  const contract: ProgrammableDefensiveTokenTransfers = ContractFactory.attach(
    contractAddress
  ) as ProgrammableDefensiveTokenTransfers;

  const failedMessages = await contract.getFailedMessages(0, 1);

  console.debug("Failed Messages", failedMessages);

  const lastReceivedMessageDetails =
    await contract.getLastReceivedMessageDetails();

  console.debug("Last Received Message Details", lastReceivedMessageDetails);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
