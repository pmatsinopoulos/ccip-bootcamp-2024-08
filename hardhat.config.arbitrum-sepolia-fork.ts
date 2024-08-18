import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { NetworkUserConfig } from "hardhat/types";
import { CustomNetworkConfig } from "./types/CustomNetworkConfig";

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      evmVersion: "shanghai",
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: "u",
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      },
      chainId: 421614,
    },
  },
};

export default config;
