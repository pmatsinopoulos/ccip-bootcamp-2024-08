import hre, { ethers } from "hardhat";
import convertToCamelCase from "./convertToCamelCase";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { IERC20__factory } from "../typechain-types/factories/@openzeppelin/contracts/token/ERC20";

const getBalanceOfAddressForERC20TokenOnChain = async ({
  chain,
  address,
  token,
  tokenContractAddress,
}: {
  chain: string;
  address: string;
  token: string;
  tokenContractAddress?: string;
}): Promise<string> => {
  const chainAsKey = convertToCamelCase(chain);
  console.debug("chainAsKey", chainAsKey);

  const network = hre.config.networks[chainAsKey] as CustomNetworkConfig;
  const provider = new ethers.JsonRpcProvider(network.url);
  let _tokenContractAddress = tokenContractAddress;
  if (typeof _tokenContractAddress === "undefined") {
    _tokenContractAddress = network[`${token.toLowerCase()}TokenAddress`];
  }

  // I need to load the Token Contract. Basically this is an ERC20 token correct?
  const tokenContract = new ethers.Contract(
    _tokenContractAddress || "",
    IERC20__factory.abi,
    provider
  );

  // I will call to find the balance of the address
  const balance = await tokenContract.balanceOf(address);

  return ethers.formatEther(balance);
};

export default getBalanceOfAddressForERC20TokenOnChain;
