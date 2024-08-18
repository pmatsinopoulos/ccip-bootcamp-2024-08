import fs from "fs";
import path from "path";

const writeContractAddressToFile = (
  networkName: string,
  contractName: string,
  contractAddress: string
) => {
  const filePath = path.join(
    __dirname,
    `../scripts/${networkName || "localhost"}_${contractName}.json`
  );
  const stringToWrite = JSON.stringify({
    contractAddress,
  });
  fs.writeFileSync(filePath, stringToWrite);
};

export default writeContractAddressToFile;
