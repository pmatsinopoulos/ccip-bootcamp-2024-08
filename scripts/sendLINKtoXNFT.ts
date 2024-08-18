import hre, { ethers } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { IERC20__factory } from "../typechain-types/factories/@openzeppelin/contracts/token/ERC20";
import readContractAddress from "../utils/readContractAddress";
import getSigningWalletForCurrentNetwork from "../utils/getSigningWalletForCurrentNetwork";

const main = async () => {
  console.log("Starting...");

  const network = hre.network.config as CustomNetworkConfig;

  const token = "LINK";
  const tokenContractAddress = network[`${token.toLowerCase()}TokenAddress`];
  const signingWallet = getSigningWalletForCurrentNetwork();

  // I need to load the Token Contract. Basically this is an ERC20 token correct?
  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    IERC20__factory.abi,
    signingWallet
  );

  const xNFTAddressArbitrumSepolia = readContractAddress(network.name, "XNFT");

  const value = ethers.parseEther("17"); // This will transfer LINK from my wallet to XNFT contract

  const trx = await tokenContract.transfer(xNFTAddressArbitrumSepolia, value);

  const response = await trx.wait();

  console.log("Response", response);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
