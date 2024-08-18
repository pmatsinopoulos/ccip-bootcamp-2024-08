import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import hre from "hardhat";
import { ethers } from "hardhat";

import getSigningWalletForCurrentNetwork from "../utils/getSigningWalletForCurrentNetwork";
import readContractAddress from "../utils/readContractAddress";
import { XNFT } from "../typechain-types";

const CONTRACT_NAME = "XNFT";

const main = async () => {
  console.log("Starting");

  const signingWallet = getSigningWalletForCurrentNetwork();

  const network = hre.network.config as CustomNetworkConfig;
  const networkName = network.name;

  const contractAddress = readContractAddress(networkName, CONTRACT_NAME);

  const ContractFactory = await ethers.getContractFactory(
    CONTRACT_NAME,
    signingWallet
  );

  const contract = ContractFactory.attach(contractAddress) as XNFT;

  const from = await signingWallet.getAddress();
  const to = from;

  const ethereum = hre.config.networks.ethereumSepolia as CustomNetworkConfig;
  const ethereumChainSelector = ethereum.ccipChainSelector;

  console.debug(
    "About to crossChainTransfer XNFT from",
    from,
    "to",
    to,
    "Ethereum CCIP Chain Selector",
    ethereumChainSelector
  );

  const trx = await contract.crossChainTransferFrom(
    from,
    to,
    BigInt("0"),
    ethereumChainSelector,
    BigInt("1") // pay in LINK
  );

  const response = await trx.wait();

  console.debug("Response", response);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
