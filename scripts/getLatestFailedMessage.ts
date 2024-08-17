import hre, { ethers } from "hardhat";
import { vars } from "hardhat/config";
import fs from "fs";
import path from "path";
import { ContractAddressInFile } from "../types/ContractAddressInFile";
import {
  ProgrammableDefensiveTokenTransfers,
  ProgrammableDefensiveTokenTransfers__factory,
} from "../typechain-types";

const CONTRACT_NAME = "ProgrammableDefensiveTokenTransfers";

function readContractAddress(): string {
  const networkName = hre.network.config.name;

  const filePath = path.join(__dirname, `${networkName}_${CONTRACT_NAME}.json`);

  const fileContents = fs.readFileSync(filePath, "utf-8");

  const dataJson: ContractAddressInFile = JSON.parse(fileContents);

  return dataJson.contractAddress;
}

async function main() {
  const contractAddress = readContractAddress();

  console.debug("contract address", contractAddress);

  const ContractFactory: ProgrammableDefensiveTokenTransfers__factory =
    await ethers.getContractFactory(CONTRACT_NAME);
  const contract: ProgrammableDefensiveTokenTransfers = ContractFactory.attach(
    contractAddress
  ) as ProgrammableDefensiveTokenTransfers;

  // need to call function setSimRevert

  const failedMessages = await contract.getFailedMessages(0, 1);

  console.debug(failedMessages);

  console.log("Failed Messages", failedMessages);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
