import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { NetworkUserConfig } from "hardhat/types";
import { CustomNetworkConfig } from "./types/CustomNetworkConfig";

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    baseSepolia: {
      name: "Base Sepolia",
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      routerAddress: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
      linkTokenAddress: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
    } as CustomNetworkConfig,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
