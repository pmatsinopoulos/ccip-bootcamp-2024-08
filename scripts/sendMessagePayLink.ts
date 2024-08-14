import hre, { ethers } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import path from "path";
import fs from "fs";
import { ContractAddressInFile } from "../types/ContractAddressInFile";
import readContractAddress from "../utils/readContractAddress";
import {
  ProgrammableDefensiveTokenTransfers,
  ProgrammableDefensiveTokenTransfers__factory,
} from "../typechain-types";
import { vars } from "hardhat/config";
import { token } from "../typechain-types/@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts";

const CONTRACT_NAME = "ProgrammableDefensiveTokenTransfers";
const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");

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
  const wallet = new ethers.Wallet(WALLET_ACCOUNT_PRIVATE_KEY, provider);

  const ContractFactory = await ethers.getContractFactory(
    CONTRACT_NAME,
    wallet
  );

  const contract: ProgrammableDefensiveTokenTransfers = ContractFactory.attach(
    contractAddress
  ) as ProgrammableDefensiveTokenTransfers;

  const destinationChainSelector =
    config.networks.ethereumSepolia.ccipChainSelector;

  console.debug("destinationChainSelector", destinationChainSelector);

  const destinationContractAddress = readContractAddress(
    "Ethereum Sepolia",
    CONTRACT_NAME
  );

  console.debug("destinationContractAddress", destinationContractAddress);

  const message = "Hello World!";

  const tokenAddress = (hre.network.config as CustomNetworkConfig)
    .ccipBnMContractAddress;

  console.debug(
    "CCIP-BnM Contract Address at",
    currentNetworkName,
    "is",
    tokenAddress
  );

  const amountOfTokens = 1000000000000000n; // 0.001

  const tx = await contract.sendMessagePayLINK(
    destinationChainSelector, // Ethereum Sepolia
    destinationContractAddress, // Ethereum Sepolia Contract Address
    message, // the text message to send
    tokenAddress, // the CCIP-BnM Token Address, since we are sending CCIP-BnM
    amountOfTokens // the amount of CCIP-BnM to send over
  );

  const txReceipt = await tx.wait();

  console.debug("Transaction receipt", txReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
