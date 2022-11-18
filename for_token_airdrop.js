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
const GAS_FOR_FT_TRANSFER= "4000000000000";
const MAX_GAS = "300000000000000";
const DEPOSIT = "450000000000000000000";
const ONE_YOCTO = "1";
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

const STAKING_CONTRACT_ID = "kokumokongz_staking_wallet.near";
const TOKEN_CONTRACT_ID = "kokumokongz_token_wallet.near";
const NFT_CONTRACT_ID = "banc.neartopia.near";

const AirDrop = async () => {
  //Load Your Account
  const near = await connect(config);

  // STEP 4 enter your mainnet or testnet account name here!
  const account = await near.account(TOKEN_CONTRACT_ID);

  let result;
  result = await account.getAccessKeys();
  console.log(result);

  let airdrop = [
    {
      name: "veejayrex.near",
      amount: "200"
    },
    {
      name: "hessmart.near",
      amount: "200"
    },
    {
      name: "newein.near",
      amount: "100"
    },
    {
      name: "a5e34454d4262f68c2a6613b76f6ecfe1f00cd3af08698e1ae4b5247d1d6e9dd",
      amount: "200"
    },
    {
      name: "moffelvdbuurt.near",
      amount: "500"
    },
    {
      name: "khanamjad096.near",
      amount: "100"
    },
    {
      name: "aldi100.near",
      amount: "100"
    },
    {
      name: "r76.near",
      amount: "200"
    },
    {
      name: "codedforum.near",
      amount: "100"
    },
    {
      name: "onium.near",
      amount: "100"
    },
  ]
  for(let i=0; i<airdrop.length; i++){
    const resultSend = await account.functionCall({
      contractId: TOKEN_CONTRACT_ID,
      methodName: "ft_transfer",
      args: {
        receiver_id: airdrop[i].name,
        amount: parseNearAmount(airdrop[i].amount),
        memo: JSON.stringify({ msg: "Airdrop to NFT Holder" })
      },
      gas: GAS_FOR_FT_TRANSFER,
      attachedDeposit: ONE_YOCTO,
    });
  }

  // result = await account.viewFunction(
  //   NFT_CONTRACT_ID,
  //   "nft_tokens",
  //   {
  //     from_index: "580",
  //     limit: 15,
  //   }
  // ); 

  // function isEmpty(obj) {
  //   for(var prop in obj) {
  //     if(Object.prototype.hasOwnProperty.call(obj, prop)) {
  //       return false;
  //     }
  //   }
  
  //   return JSON.stringify(obj) === JSON.stringify({});
  // }

  // for(let i=0; i<result.length; i++){
  //   if(isEmpty(result[i].approved_account_ids) && result[i].owner_id != "vexpremint.near" )
  //   {
  //     console.log(result[i].token_id, ":", result[i].owner_id);
  //     try{
  //       const resultSend = await account.functionCall({
  //         contractId: TOKEN_CONTRACT_ID,
  //         methodName: "ft_transfer",
  //         args: {
  //           receiver_id: result[i].owner_id,
  //           amount: parseNearAmount("100"),
  //           memo: JSON.stringify({ msg: "Airdrop to NFT Holder" })
  //         },
  //         gas: GAS_FOR_FT_TRANSFER,
  //         attachedDeposit: ONE_YOCTO,
  //       });
  //     } catch (error){
  //       console.log(error);
  //     }
  //   }
  // }

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

AirDrop();
