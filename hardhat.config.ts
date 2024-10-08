import * as envEnc from "@chainlink/env-enc";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { NetworkUserConfig } from "hardhat/types";
import { CustomNetworkConfig } from "./types/CustomNetworkConfig";

envEnc.config();

const ALCHEMY_API_KEY = process.env.HARDHAT_VAR_ALCHEMY_API_KEY || "";
const WALLET_ACCOUNT_PRIVATE_KEY =
  process.env.HARDHAT_VAR_WALLET_ACCOUNT_PRIVATE_KEY || "";

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
    localhost: {
      name: "Localhost",
      url: `http://localhost:8545`,
    } as CustomNetworkConfig,
    baseSepolia: {
      name: "Base Sepolia",
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      routerAddress: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
      linkTokenAddress: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
      ccipChainSelector: "10344971235874465080",
      ccipBnMContractAddress: "0x88A2d74F47a237a62e7A51cdDa67270CE381555e",
    } as CustomNetworkConfig,
    ethereumSepolia: {
      name: "Ethereum Sepolia",
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      routerAddress: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
      linkTokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      ccipChainSelector: "16015286601757825753",
    } as CustomNetworkConfig,
    ethereumSepoliaLocalFork: {
      name: "Ethereum Sepolia Local Fork",
      url: "http://127.0.0.1:8546",
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      ccipChainSelector: "16015286601757825753",
    } as CustomNetworkConfig,
    arbitrumSepolia: {
      name: "Arbitrum Sepolia",
      url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      routerAddress: "0x2a9c5afb0d0e4bab2bcdae109ec4b0c4be15a165",
      linkTokenAddress: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
      ccipChainSelector: "3478487238524512106",
      ccipBnMContractAddress: "",
    } as CustomNetworkConfig,
    arbitrumSepoliaLocalFork: {
      name: "Arbitrum Sepolia Local Fork",
      url: "http://127.0.0.1:8545",
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      chainId: 421614,
    } as CustomNetworkConfig,
  },
};

export default config;
