import hre, { ethers } from "hardhat";
import convertToCamelCase from "./convertToCamelCase";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import { IERC721__factory } from "../typechain-types/factories/@openzeppelin/contracts/token/ERC721";

const getOwnerOfERC721TokenId = async ({
  chain,
  tokenId,
  token,
  tokenContractAddress,
}: {
  chain: string;
  tokenId: BigInt;
  token: string;
  tokenContractAddress: string | undefined;
}): Promise<string> => {
  const chainAsKey = convertToCamelCase(chain);
  console.debug("chainAsKey", chainAsKey);

  const network = hre.config.networks[chainAsKey] as CustomNetworkConfig;
  const provider = new ethers.JsonRpcProvider(network.url);
  let _tokenContractAddress = tokenContractAddress;
  if (typeof _tokenContractAddress === "undefined") {
    _tokenContractAddress = network[`${token.toLowerCase()}TokenAddress`];
  }

  // I need to load the Token Contract. Basically this is an ERC721 token correct?
  const tokenContract = new ethers.Contract(
    _tokenContractAddress || "",
    IERC721__factory.abi,
    provider
  );

  // I will call to find the balance of the address
  const owner = await tokenContract.ownerOf(tokenId);

  return owner;
};

export default getOwnerOfERC721TokenId;
