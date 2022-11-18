<!-- near create-account anc_staking_wallet_01.supernova11.near --masterAccount supernova11.near --initialBalance 3 -->
near create-account token_test01.supernova11.testnet --masterAccount supernova11.testnet --initialBalance 3

near deploy --accountId token_test01.supernova11.testnet --wasmFile out/kokumo_token.wasm --initFunction new --initArgs '{"owner_id": "supernova11.testnet"}'
<!-- near deploy --accountId stakingancwallet2.near --wasmFile out/kokumo_stake.wasm --initFunction new --initArgs '{"owner_id": "supernova11.near"}' -->
