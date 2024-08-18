import { ethers, network } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import writeContractAddressToFile from "../utils/writeContractAddressToFile";
import hre from "hardhat";
import { vars } from "hardhat/config";
import readContractAddress from "../utils/readContractAddress";
import { XNFT } from "../typechain-types";
import getSigningWalletForCurrentNetwork from "../utils/getSigningWalletForCurrentNetwork";

const CONTRACT_NAME = "XNFT";
const WALLET_ACCOUNT_PRIVATE_KEY = vars.get("WALLET_ACCOUNT_PRIVATE_KEY");

async function main() {
  // Create a wallet instance using private key and provider

  const ethereumSepolia = hre.network.config as CustomNetworkConfig;
  const arbitrumSepolia = hre.config.networks
    .arbitrumSepolia as CustomNetworkConfig;

  const signingWallet = getSigningWalletForCurrentNetwork();

  const arbitrumSepoliaChainSelector = arbitrumSepolia.ccipChainSelector;
  const xNftAddressArbitrumSepolia = readContractAddress(
    arbitrumSepolia.name,
    CONTRACT_NAME
  );

  const contractAddress = readContractAddress(
    ethereumSepolia.name,
    CONTRACT_NAME
  );

  const ContractFactory = await ethers.getContractFactory(
    CONTRACT_NAME,
    signingWallet
  );

  const contract = ContractFactory.attach(contractAddress) as XNFT;

  const ccipExtraArgs = process.env.ARG_CCIP_EXTRA_ARGS || "";

  console.debug(
    "Calling enableChain with destination chainSelector",
    arbitrumSepoliaChainSelector,
    "destination xNftAddress",
    xNftAddressArbitrumSepolia,
    "ccipExtraArgs",
    ccipExtraArgs
  );

  const tx = await contract.enableChain(
    arbitrumSepoliaChainSelector,
    xNftAddressArbitrumSepolia,
    ccipExtraArgs
  );

  const response = await tx.wait();

  console.debug("Response", response);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
