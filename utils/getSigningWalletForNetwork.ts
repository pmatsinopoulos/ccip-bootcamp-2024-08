import { ethers } from "hardhat";
import hre from "hardhat";
import { vars } from "hardhat/config";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { Wallet } from "ethers";
import convertToCamelCase from "./convertToCamelCase";

const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");

const getSigningWalletForNetwork = ({
  networkName,
}: {
  networkName: string;
}): Wallet => {
  const networkNameAsKey = convertToCamelCase(networkName);
  const network = hre.config.networks[networkNameAsKey] as CustomNetworkConfig;

  const provider = new ethers.JsonRpcProvider(network.url);
  const wallet = new ethers.Wallet(WALLET_ACCOUNT_PRIVATE_KEY);
  return wallet.connect(provider);
};

export default getSigningWalletForNetwork;
