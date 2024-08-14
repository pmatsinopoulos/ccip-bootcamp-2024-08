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
const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");

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

  // Create a wallet instance using private key and provider
  const provider = new ethers.JsonRpcProvider(hre.network.config.url);
  const wallet = new ethers.Wallet(WALLET_ACCOUNT_PRIVATE_KEY, provider);

  const ContractFactory: ProgrammableDefensiveTokenTransfers__factory =
    await ethers.getContractFactory(CONTRACT_NAME, wallet);
  const contract: ProgrammableDefensiveTokenTransfers = ContractFactory.attach(
    contractAddress
  ) as ProgrammableDefensiveTokenTransfers;

  // need to call function setSimRevert

  const trx = await contract.retryFailedMessage(
    "0x05e039ef13954ca216f61a08008ed66c5ef7a8cfc39a83240c61c583e7cafa80",
    "0x3DDEB127020D41D2761c7B8Ae13B23A77f0f530B"
  );

  console.debug(trx);

  // wait for the transaction to be mined
  const receipt = await trx.wait();

  console.log("Transaction mined. Receipt", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
