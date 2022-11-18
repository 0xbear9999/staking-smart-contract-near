// Welcome to the Mass Key Deletion recipe.

// This tool allows you to
// 1. Delete all your functionCall Access Keys
// 2. Delete all but one specified Full Access Key
// 3. Delete all Full Access Keys and Lock an Account

/// STEP 1 Install near-api-js
// npm init (in directory where you stored this script)
// npm i near-api-js

const nearAPI = require("near-api-js"); // imports near api js
const { parseNearAmount } = require("near-api-js/lib/utils/format");

// Standard setup to connect to NEAR While using Node
const { keyStores, connect } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
let config;

// STEP 2 Choose your configuration.
// set this variable to either "testnet" or "mainnet"
// if you haven't used this before use testnet to experiment so you don't lose real tokens by deleting all your access keys
const configSetting = "mainnet";

const GAS_FOR_NFT_APPROVE = "20000000000000";
const GAS_FOR_RESOLVE_TRANSFER = "10000000000000";
const MAX_GAS = "300000000000000";
const GAS_FOR_FT_TRANSFER = "4000000000000";
const DEPOSIT = "450000000000000000000";

// setting configuration based on input
switch (configSetting) {
  case "mainnet":
    config = {
      networkId: "mainnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    console.log("configuration set to mainnet ");

    break;

  case "testnet":
    config = {
      networkId: "testnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    console.log("configuration set to testnet ");
    break;
  default:
    console.log(`please choose a configuration `);
}

const STAKING_CONTRACT_ID = "stakingancwallet2.near";
const TOKEN_CONTRACT_ID = "anctokenwallet.near";
const NFT_CONTRACT_ID = "apenearclub.near";

const Test = async () => {
  //Load Your Account
  const near = await connect(config);

  // STEP 4 enter your mainnet or testnet account name here!
  const account = await near.account("stakingancwallet2.near");
  const tokenContractAccount = await near.account(TOKEN_CONTRACT_ID);

  let result;
  result = await account.viewFunction(
    TOKEN_CONTRACT_ID,
    "ft_balance_of",
    {
      account_id: account.accountId,
    }
  );
  console.log("stakingancwallet2.near ANCAmount:", result);

  result = await account.viewFunction(
    STAKING_CONTRACT_ID,
    "get_claim_amount",
    {
      account_id: account.accountId,
    }
  );
  console.log("ClaimAmout:", result);

  // transfer anc token to staking contract
  // result = await tokenContractAccount.functionCall({
  //   contractId: TOKEN_CONTRACT_ID,
  //   methodName: "ft_transfer",
  //   args: {
  //     receiver_id: STAKING_CONTRACT_ID,
  //     amount: parseNearAmount("3000000"),
  //     msg: JSON.stringify({ msg: "Stake to Platform" })
  //   },
  //   gas: GAS_FOR_FT_TRANSFER,
  //   attachedDeposit: "1",
  // })

  // STAKING
  // result = await account.functionCall({
  //   contractId: NFT_CONTRACT_ID,
  //   methodName: "nft_approve",
  //   args: {
  //     token_id: "QmVmz2KGaWW9qWvzajHSGNjpx1odxaXBaCGeaNwd8JsFyo",
  //     account_id: STAKING_CONTRACT_ID,
  //     msg: JSON.stringify({ staking_status: "Stake to Platform" })
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: DEPOSIT,
  // });

  // CLAIMING
  // result = await account.functionCall({
  //   contractId: STAKING_CONTRACT_ID,
  //   methodName: "claim_reward",
  //   args: {
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: "1",
  // });
  // console.log(result);

  // UNSTAKING
  // result = await account.functionCall({
  //   contractId: STAKING_CONTRACT_ID,
  //   methodName: "unstake",
  //   args: {
  //     token_id: "QmVmz2KGaWW9qWvzajHSGNjpx1odxaXBaCGeaNwd8JsFyo" 
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: "1",
  // });
  // console.log(result);
};

Test();
