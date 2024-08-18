import { ethers, network } from "hardhat";
import { CustomNetworkConfig } from "../types/CustomNetworkConfig";
import writeContractAddressToFile from "../utils/writeContractAddressToFile";

const CONTRACT_NAME = "EncodeExtraArgs";

async function main() {
  console.log(`Deploying contract ${CONTRACT_NAME}`);

  const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const networkConfig = network.config as CustomNetworkConfig;

  const contract = await ContractFactory.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.debug(
    `Chain: ${networkConfig.name}, ${CONTRACT_NAME} deployed address ${contractAddress}`
  );

  writeContractAddressToFile(
    networkConfig.name,
    CONTRACT_NAME,
    contractAddress
  );

  // Get the arguments from the command line
  const argGasLimit = process.env.ARG_GAS_LIMIT || "";

  const gasLimit = BigInt(argGasLimit);

  console.debug("Gas limit", gasLimit);

  // encode

  const encodedData = await contract.encode(gasLimit);

  console.debug("Encoded data", encodedData);

  // double check that we can decode back
  const decodedGasLimit = await contract.decode(encodedData);

  console.debug("Decoded gas limit", decodedGasLimit);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
