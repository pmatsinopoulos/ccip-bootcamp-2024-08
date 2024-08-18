import { ethers } from "hardhat";
import readContractAddress from "./readContractAddress";

const loadDeployedContractInstance = async ({
  networkName,
  contractName,
  jsonRpcProviderUrl,
}: {
  networkName: string;
  contractName: string;
  jsonRpcProviderUrl: string;
}) => {
  const contractAddress = readContractAddress(networkName, contractName);

  console.log(`${networkName} XNFT address ${contractAddress}`);

  const provider = new ethers.JsonRpcProvider(jsonRpcProviderUrl);

  const ContractFactory = await ethers.getContractFactory(contractName);

  const contract = new ethers.Contract(
    contractAddress,
    ContractFactory.interface,
    provider
  );

  return contract;
};

export default loadDeployedContractInstance;
