import hre from "hardhat";
import { ethers } from "hardhat";
import readContractAddress from "../utils/readContractAddress";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { XNFT } from "../typechain-types";
import getSigningWalletForCurrentNetwork from "../utils/getSigningWalletForCurrentNetwork";

const CONTRACT_NAME = "XNFT";

const main = async () => {
  console.log("Starting...");

  const network = hre.network.config as CustomNetworkConfig;
  const networkName = network.name;

  const contractAddress = readContractAddress(networkName, CONTRACT_NAME);

  const signingWallet = getSigningWalletForCurrentNetwork();

  const ContractFactory = await ethers.getContractFactory(
    CONTRACT_NAME,
    signingWallet
  );

  const contract = ContractFactory.attach(contractAddress) as XNFT;

  const trx = await contract.mint();

  const response = await trx.wait();

  console.debug("Response", response);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
