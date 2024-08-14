import { AddressLike } from "ethers";
import { NetworkUserConfig } from "hardhat/types";

type CustomNetworkConfig = NetworkUserConfig & {
  name: string;
  ccipChainSelector: string;
  routerAddress: AddressLike;
  linkTokenAddress: AddressLike;
  ccipBnMContractAddress: AddressLike;
};

export { CustomNetworkConfig };
