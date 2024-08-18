import hre from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { Wallet } from "ethers";
import getSigningWalletForNetwork from "./getSigningWalletForNetwork";

const getSigningWalletForCurrentNetwork = (): Wallet => {
  const network = hre.network.config as CustomNetworkConfig;

  return getSigningWalletForNetwork({ networkName: network.name });
};

export default getSigningWalletForCurrentNetwork;
