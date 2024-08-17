import { ethers } from "hardhat";
import hre from "hardhat";
import { vars } from "hardhat/config";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { Wallet } from "ethers";

const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");

const getSigningWalletForCurrentNetwork = (): Wallet => {
  const network = hre.network.config as CustomNetworkConfig;

  const provider = new ethers.JsonRpcProvider(network.url);
  const wallet = new ethers.Wallet(WALLET_ACCOUNT_PRIVATE_KEY);
  return wallet.connect(provider);
};

export default getSigningWalletForCurrentNetwork;
