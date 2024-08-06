import { AddressLike } from "ethers";
import { NetworkUserConfig } from "hardhat/types";

type CustomNetworkConfig = NetworkUserConfig & {
  name: string;
  routerAddress: AddressLike;
  linkTokenAddress: AddressLike;
};

export { CustomNetworkConfig };
