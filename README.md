# DAY 1

## Exercise 1

*Sending CCIP Message from a chain (`Base Sepolia`) to another chain (`Ethereum Sepolia`)*

I work with Hardhat.

Instead of `Avalanche Fuji` I use `Base Sepolia` as the source network.

I deployed `ProgrammableDefensiveTokenTransfers` to `Base Sepolia`.

```bash
$ npx hardhat --network baseSepolia run scripts/deployProgrammableDefensiveTokenTransfers.ts
...
```

For this to happen, I made sure I had enough `ETH` on `Base Sepolia` to allow for the transfer. The transaction
can be found [here](https://sepolia.basescan.org/tx/0x19d4958218b07eda8c50e43172855a7acd544b9947f4cb97445f5b1e818be654).

My `Base Sepolia` wallet needs to have `CCIP-BnM` tokens for the exercise to continue. How can I transfer `0.002` `CCIP-BnM` to my contract?
How do I do it?

- I locate the token in [BaseScan](https://sepolia.basescan.org/token/0x88a2d74f47a237a62e7a51cdda67270ce381555e)
- I go to Write Contract and Connect to Web3 my wallet.
- Then I transact with the `drip` function. This will give my wallet `1 CCIP-BnM` on `Base Sepolia`.

Then I can use my Metamask wallet to transfer `0.002` of `CCIP-BnM` to the contract address (registered [here](./scripts/Base%20Sepolia_ProgrammableDefensiveTokenTransfers.json))

Then I need to enable my contract to send CCIP messages to `Ethereum Sepolia`.
I will do it using script `scripts/enableProgrammableDefensiveTokenTransfersToSendCCIPMessagesToDestinationChain.ts`

**Important**: This will need to take ETH from my wallet. So, I need to have enough ETH in my MetaMask
wallet.

```bash
$ npx hardhat run --network baseSepolia scripts/enableProgrammableDefensiveTokenTransfersToSendCCIPMessagesToDestinationChain.ts
...
```

We need to deploy the `ProgrammableDefensiveTokenTransfers` to `Ethereum Sepolia` (destination network):

The following two require ETH on `Ethereum Sepolia`. I need to make sure I have enough or otherwise use a faucet to fund it.

```bash
$ npx hardhat --network ethereumSepolia run scripts/deployProgrammableDefensiveTokenTransfers.ts
...
```

and then enable receiving messages from the contract on `Base Sepolia` (source network)

```bash
$ npx hardhat --network ethereumSepolia run scripts/enableProgrammableDefensiveTokenTransfersToReceiveCCIPMessagesFromSourceChain.ts
...
```

Then, I need to allow the `Ethereum Sepolia` (destination) contract to receive messages from the `Base Sepolia` (source)
contract. This is the `allowListSender()` function on the contract on `Ethereum Sepolia`.

```bash
$ npx hardhat --network ethereumSepolia run scripts/enableProgrammableDefensiveTokenTransfersToReceiveCCIPMessagesFromSourceContract.ts
```

Then call the `setSimRevert()` passing `true`. This simulates a failure in processing incoming message.

```bash
$ npx hardhat --network ethereumSepolia run scripts/simulateRevert.ts
```

At this point, I have one sender contract on `Base Sepolia` and one receiver contract on `Ethereum Sepolia`. As security measures, I enabled the sender contract to send CCIP messages to `Ethereum Sepolia` and the receiver contract to receive CCIP messages from the sender on `Base Sepolia`. The receiver contract cannot process the message, and therefore, instead of throwing an exception, it will lock the received tokens, enabling the owner to recover them.

Then, I open MetaMask and connect to `Base Sepolia`. I fund the contract with `LINK` tokens.
I can transfer `0.5` `LINK` to the contract. In this example, `LINK` is used to pay the CCIP fees.

*Note:* If I don't have enough `LINK` to my `Base Sepolia` wallet, I can faucet [here](https://faucets.chain.link/)

Then I am going to send string data with tokens (`CCIP-BnM`) from `Base Sepolia` to `Ethereum Sepolia`.
I will need to have both `ETH` in my `Base Sepolia` account for the transaction, as well as the
necessary amount of `CCIP-BnM` that I want to send over.

I am going to call the `sendMessagePayLINK()` on the `Base Sepolia` network:

```bash
$ npx hardhat --network baseSepolia run scripts/sendMessagePayLink.ts
...
```
The transaction hash is `0xa2f7f1ecf639f7377c4e7e555407045fd0634496340bceb811ad11bbe92b675a` on `Ethereum Sepolia`.

Then, I need to get the last failed message stored in the receiving contract:

```bash
$ npx hardhat --network ethereumSepolia run scripts/getLatestFailedMessage()
```
The result message id: `0x05e039ef13954ca216f61a08008ed66c5ef7a8cfc39a83240c61c583e7cafa80` with result code `1`.

Then, I call the `retryFailedMessage()` to recover the tokens. I pass the message id and the token receiver, which is the
address of the `Ethereum Sepolia` smart contract.

I got back the transaction hash: `0x1bc59379d46c810fce54fc801de5cc706bca6ea7e29659240962d4c4c9bf9a46`

# Day 2

## Exercise 2: Build Your First Cross-Chain NFT

I have deployed the contract `XNFT` to `Ethereum Sepolia` by running:

```bash
$ npx hardhat --network ethereumSepolia run scripts/deployXNFT.ts
```

I have deployed the contract `XNFT` to `Arbitrum Sepolia` by running:

```bash
$ npx hardhat --network arbitrumSepolia run scripts/deployXNFT.ts
```

I have created the contract [contracts/EncodeExtraArgs.sol](./contracts/EncodeExtraArgs.sol),
with content from the page of the exercise. It will help me encode extra args, as follows:

I compile the contract:

```bash
$ npx hardhat compile
```

And then I run the following script to get encoded extra args script:

```bash
$ ARG_GAS_LIMIT=200000 npx hardhat run scripts/encodeExtraArgs.ts
```

which gives me a string like:

`0x97a657c90000000000000000000000000000000000000000000000000000000000030d40`

Then I call `enableChain()` on the destination network `Ethereum Sepolia` to enable
the source chain `Arbitrum Sepolia` and the source contract `XNFT`.

```bash
$ ARG_CCIP_EXTRA_ARGS='0x97a657c90000000000000000000000000000000000000000000000000000000000030d40' npx hardhat --network ethereumSepolia run scripts/enableArbitrumSepoliaOnEthereumSepolia.ts
```
This returned the transaction: `0xfcb0fd1b8c0288ae81225a1db2424a9cfdd72fe53292ddc1a635c66232d5f4ac` on `Ethereum Sepolia`.

Then I need to call "enableChain()" on Arbitrum Sepolia, to enable Ethereum Sepolia and XNFT on Ethereum Sepolia.
This is the reverse enablement to the previous one.

```bash
$ ARG_CCIP_EXTRA_ARGS='0x97a657c90000000000000000000000000000000000000000000000000000000000030d40' npx hardhat --network arbitrumSepolia run scripts/enableEthereumSepoliaOnArbitrumSepolia.ts
```

This returned the transaction `0x506bbff810709eedb696a521849da71fbfd3b5a4e57a02577b46eab6b5ea0c1d` on Arbitrum Sepolia.

Then I need to make sure that the `XNFT` smart contract on `Arbitrum Sepolia` has some `LINK` to cover for CCIP fees.
So, the source contract needs to have enough `LINK` fee to pay for the CCIP. Not the sender wallet.
I will fund the `XNFT` on `Arbitrum Sepolia` with `3` `LINK`. I will use my MetaMask wallet to do this.
Again, I need my wallet to have `LINK` on `Arbitrum Sepolia` in order to be able to _send_ to the `XNFT` contract.
OR I can use the LINK token page on the `Arbitrum Sepolia Explorer` by going to the page, signing with my Metamask Wallet
and using the `transfer()` function.

Then we need to mint `XNFT`in source network `Arbitrum Sepolia`. I run the script:

```bash
$ npx hardhat --network arbitrumSepolia run scripts/mintXNFT.ts
```

This runs the `XNFT#mint()` function which mints a new XNFT token and sets its owner to be the signing wallet, i.e. my
Wallet address. The transaction hash is `0x0c2d075c6885c0859791bc2c65d4b4440db48701b9def39f05cf359b0fd1eb7d`.

Finally, I have to do the cross transfer of the minted XNFT from Arbitrum Sepolia to Ethereum Sepolia.

This is done with the script:

```bash
$ npx hardhat --network arbitrumSepolia run scripts/crossChainTransferXNFTToEthereumSepolia.ts
```

This is calling the `XNFT#crossChainTransferFrom()`.

The question here is how do I get the `tokenId` of the minted `XNFT` on `Arbitrum Sepolia`. I need to have it in order
to give it as `tokenId` parameter to the `crossChainTransferFrom()`. The `XNFT#mint()` we called earlier does not return
the `tokenId`. Is there another way to get it? Yes, I can get it from the details of the transaction if I go to the
transaction viewer in Arbitrum Sepolia explorer: [https://sepolia.arbiscan.io/tx/0x0c2d075c6885c0859791bc2c65d4b4440db48701b9def39f05cf359b0fd1eb7d](https://sepolia.arbiscan.io/tx/0x0c2d075c6885c0859791bc2c65d4b4440db48701b9def39f05cf359b0fd1eb7d). There I can see this:

![mint Transaction Details gives me the tokenId minted](./images/mintXNFTtokenId.jpg)

This is telling me that the `tokenId` minted is `0`.

Also, I need to have enough `LINK` in my wallet.

# Day 3

## Exercise 3: Testing cross-chain contracts using Chainlink Local

I use the forked mode.

I used two hardhat configurations. One to fork source network `Arbitrum Sepolia` another one to fork destination network
`Ethereum Sepolia`.

Then, in two different terminals, I start the local forks:

```bash
$ npx hardhat --config hardhat.config.arbitrum-sepolia-fork.ts --port 8545
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
...
```

```bash
$ npx hardhat --config hardhat.config.ethereum-sepolia-fork.ts --port 8546
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8546/
...
```

These forks they already have deployed contracts and enablement is already as expected, because
I fork after the work I have done on these networks for the Exercise 2.
