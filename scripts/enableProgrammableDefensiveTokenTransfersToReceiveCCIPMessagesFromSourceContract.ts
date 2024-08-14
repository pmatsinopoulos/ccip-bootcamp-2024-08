import config from "../hardhat.config";
import path from "path";
import fs from "fs";
import hre from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { ContractAddressInFile } from "../types/ContractAddressInFile";
import { ethers } from "hardhat";
import { ProgrammableDefensiveTokenTransfers__factory } from "../typechain-types";
import { ProgrammableDefensiveTokenTransfers } from "../typechain-types/contracts";
import { vars } from "hardhat/config";

const CONTRACT_NAME = "ProgrammableDefensiveTokenTransfers";
const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");

function readContractAddress(): string {
  const networkName = hre.network.config.name;

  const filePath = path.join(__dirname, `${networkName}_${CONTRACT_NAME}.json`);

  const fileContents = fs.readFileSync(filePath, "utf-8");

  const dataJson: ContractAddressInFile = JSON.parse(fileContents);

  return dataJson.contractAddress;
}

function readSourceContractAddress(): string {
  const networkName = (config.networks?.baseSepolia as CustomNetworkConfig)
    .name;

  const filePath = path.join(__dirname, `${networkName}_${CONTRACT_NAME}.json`);

  const fileContents = fs.readFileSync(filePath, "utf-8");

  const dataJson: ContractAddressInFile = JSON.parse(fileContents);

  return dataJson.contractAddress;
}

async function main() {
  const sourceChainNetwork = "baseSepolia";
  const sourceContractAddress = readSourceContractAddress();

  console.debug(
    `Enabling 'ProgrammableDefensiveTokenTransfersToReceiveCCIPMessages' from source chain ${sourceChainNetwork}, with source contract address ${sourceContractAddress}`
  );

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

  // need to call function allowListSender

  const trx = await contract.allowlistSender(
    sourceContractAddress, // Base Sepolia Contract Address
    true
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
