import hre, { ethers } from "hardhat";
import readContractAddress from "../../utils/readContractAddress";
import { XNFT__factory } from "../../typechain-types";
import loadDeployedContractInstance from "../../utils/loadDeployedContractInstance";
import { CustomNetworkConfig } from "../../types/CustomNetworkConfig";
import { IERC20 } from "../../typechain-types/@openzeppelin/contracts/token/ERC20";
import { expect } from "chai";
import { Contract } from "ethers";
import convertToCamelCase from "../../utils/convertToCamelCase";
import { IERC20__factory } from "../../typechain-types/factories/@openzeppelin/contracts/token/ERC20";
import getBalanceOfAddressForERC20TokenOnChain from "../../utils/getBalanceOfAddressForERC20TokenOnChain";
import getSigningWalletForCurrentNetwork from "../../utils/getSigningWalletForCurrentNetwork";
import getSigningWalletForNetwork from "../../utils/getSigningWalletForNetwork";
import getOwnerOfERC721TokenId from "../../utils/getOwnerOfERC721TokenId";
import getOwnerOfERC721TokenId from "../../utils/getOwnerOfERC721TokenId";
import getBalanceOfAddressForERC721TokenOnChain from "../../utils/getBalanceOfAddressForERC721TokenOnChain";

const CONTRACT_NAME = "XNFT";
const ARBITRUM_SEPOLIA_LOCAL_FORK_URL = "http://127.0.0.1:8545"; // source network for cross chain transfer
const ETHEREUM_SEPOLIA_LOCAL_FORK_URL = "http://127.0.0.1:8546"; // destination network for cross chain transfer

const expectChainAndContractToBeEnabled = async ({
  contractName,
  sourceContract,
  chainName,
}: {
  contractName: string;
  sourceContract: Contract;
  chainName: string;
}) => {
  const xNFTaddress = readContractAddress(chainName, contractName);
  const chainNameAsKey = convertToCamelCase(chainName);
  const chainNetwork: CustomNetworkConfig = hre.config.networks[
    chainNameAsKey
  ] as CustomNetworkConfig;
  const chainSelector = chainNetwork.ccipChainSelector;

  const [xNFTaddressFound, ccipExtraArgsBytes] = await sourceContract.s_chains(
    chainSelector
  );

  console.log(
    "xNFTaddressFound",
    xNFTaddressFound,
    "ccipExtraArgsBytes",
    ccipExtraArgsBytes
  );

  expect(xNFTaddressFound).to.equal(xNFTaddress);
  expect(ccipExtraArgsBytes).not.to.equal("0x");
};

const expectAddressBalanceForTokenOnNetworkToBeMoreThan = async ({
  address,
  chain,
  token,
  amount,
}: {
  address: string;
  chain: string;
  token: string;
  amount: string;
}) => {
  const balanceInEthStr = await getBalanceOfAddressForERC20TokenOnChain({
    chain,
    address,
    token,
  });

  expect(Number.parseFloat(balanceInEthStr)).to.be.at.least(
    Number.parseFloat(amount)
  );
};

const xNFTMintOnArbitrumSepolia = async ({
  arbitrumSepoliaXNFT,
}: {
  arbitrumSepoliaXNFT: Contract;
}) => {
  const signer = getSigningWalletForNetwork({
    networkName: "Arbitrum Sepolia Local Fork",
  });
  const trx = await arbitrumSepoliaXNFT.connect(signer).mint();

  const response = await trx.wait();

  const transferEventTopic = ethers.id("Transfer(address,address,uint256)");

  const transferERC721 = response.logs.filter(
    (log) => log.topics[0] === transferEventTopic
  )[0];

  console.log("Token id", transferERC721.args[2]);

  return transferERC721.args[2];
};

const crossChainXNFTFromArbitrumToEthereum = async ({
  tokenId,
  arbitrumSepoliaXNFT,
}: {
  tokenId: BigInt;
  arbitrumSepoliaXNFT: Contract;
}) => {
  const arbitrumSigner = getSigningWalletForNetwork({
    networkName: "Arbitrum Sepolia Local Fork",
  });

  const ethereumSepoliaLocalForkNetwork = hre.config.networks
    .ethereumSepoliaLocalFork as CustomNetworkConfig;
  const ethereumSepoliaChainSelector =
    ethereumSepoliaLocalForkNetwork.ccipChainSelector;

  const signerAddress = (await arbitrumSigner.getAddress()).toString();

  const trx = await arbitrumSepoliaXNFT
    .connect(arbitrumSigner)
    .crossChainTransferFrom(
      signerAddress,
      signerAddress,
      tokenId,
      ethereumSepoliaChainSelector,
      BigInt("1") // pay in LINK
    );

  const receipt = await trx.wait();

  console.log("Receipt of cross chain transfer", receipt);
};

describe("XNFT", function () {
  this.beforeAll(function () {
    console.log("Before All...");
  });

  it("does a cross chain XNFT from Arbitrum Sepolia to Ethereum Sepolia", async function () {
    console.log("Doing cross chain XNFT");

    // load the Ethereum Sepolia contract
    const ethereumSepoliaXNFT = await loadDeployedContractInstance({
      networkName: "Ethereum Sepolia",
      contractName: CONTRACT_NAME,
      jsonRpcProviderUrl: ETHEREUM_SEPOLIA_LOCAL_FORK_URL,
    });
    // ------------- end of loading the ethereumSepoliaXNFT -----------------

    // load the Arbitrum Sepolia contract
    const arbitrumSepoliaXNFT = await loadDeployedContractInstance({
      networkName: "Arbitrum Sepolia",
      contractName: CONTRACT_NAME,
      jsonRpcProviderUrl: ARBITRUM_SEPOLIA_LOCAL_FORK_URL,
    });
    // ------------- end of loading the arbitrumSepoliaXNFT -----------------

    // check that the network Arbitrum Sepolia and the XNFT contract on Arbitrum Sepolia
    // are enabled on source network Ethereum Sepolia
    await expectChainAndContractToBeEnabled({
      contractName: CONTRACT_NAME,
      sourceContract: ethereumSepoliaXNFT,
      chainName: "Arbitrum Sepolia",
    });

    // check that Ethereum Sepolia chain and XNFT of Ethereum Sepolia is enabled on the
    // destination Arbitrum Sepolia network.
    await expectChainAndContractToBeEnabled({
      contractName: CONTRACT_NAME,
      sourceContract: arbitrumSepoliaXNFT,
      chainName: "Ethereum Sepolia",
    });

    // check that the XNFT contract on source chain Arbitrum Sepolia has at least 3 LINK
    // balance. This will allow the CCIP fees to be paid.
    await expectAddressBalanceForTokenOnNetworkToBeMoreThan({
      address: (await arbitrumSepoliaXNFT.getAddress()).toString(),
      chain: "Arbitrum Sepolia",
      token: "LINK",
      amount: "3",
    });

    // mint XNFT on source network Arbitrum Sepolia
    const tokenId = await xNFTMintOnArbitrumSepolia({
      arbitrumSepoliaXNFT,
    });

    // do the cross chain transfer
    await crossChainXNFTFromArbitrumToEthereum({
      tokenId,
      arbitrumSepoliaXNFT,
    });

    // check the balance
    //-------------------
    const signingWallet = getSigningWalletForNetwork({
      networkName: "Ethereum Sepolia Local Fork",
    });
    const signingWalletAddress = (await signingWallet.getAddress()).toString();

    // Need to get the balance of the token for the signer on Ethereum
    const balanceStr = await getBalanceOfAddressForERC721TokenOnChain({
      chain: "Ethereum Sepolia Local Fork",
      address: signingWalletAddress,
      token: "XNFT",
      tokenContractAddress: (await ethereumSepoliaXNFT.getAddress()).toString(),
    });

    console.log(
      `Balance of ${signingWalletAddress.toString()} (in Ethereum Sepolia Local fork) for token XNFT is ${balanceStr}`
    );

    // Need to prove that the owner of the token in Ethereum is the signer address
    const owner = await getOwnerOfERC721TokenId({
      chain: "Ethereum Sepolia Local Fork",
      tokenId,
      token: "XNFT",
      tokenContractAddress: (await ethereumSepoliaXNFT.getAddress()).toString(),
    });

    console.log("Owner", owner);
  });
});
