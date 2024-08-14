import path from "path";
import fs from "fs";

import { ContractAddressInFile } from "../types/ContractAddressInFile";

const readContractAddress = (
  networkName: string,
  contractName: string
): string => {
  const fileName = path.join(
    __dirname,
    `../scripts/${networkName}_${contractName}.json`
  );
  const fileContents: ContractAddressInFile = JSON.parse(
    fs.readFileSync(fileName, "utf-8")
  );
  return fileContents.contractAddress;
};

export default readContractAddress;
