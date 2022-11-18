/**
* Fungible Token NEP-141 Token contract
*
* The aim of the contract is to provide a basic implementation of the improved function token standard.
*
* lib.rs is the main entry point.
* fungible_token_core.rs implements NEP-146 standard
* storage_manager.rs implements NEP-145 standard for allocating storage per account
* fungible_token_metadata.rs implements NEP-148 standard for providing token-specific metadata.
* internal.rs contains internal methods for fungible token.
*/
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::{ValidAccountId, U128};
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise, StorageUsage};

pub use crate::fungible_token_core::*;
pub use crate::fungible_token_metadata::*;
use crate::internal::*;
pub use crate::storage_manager::*;
use std::convert::TryInto;
use std::num::ParseIntError;

mod fungible_token_core;
mod fungible_token_metadata;
mod internal;
mod storage_manager;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc<'_> = near_sdk::wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    pub owner_id: AccountId,

    /// AccountID -> Account balance.
    pub accounts: LookupMap<AccountId, Balance>,

    /// Total supply of the all token.
    pub total_supply: Balance,

    /// The storage size in bytes for one account.
    pub account_storage_usage: StorageUsage,

    pub ft_metadata: FungibleTokenMetadata,
}

impl Default for Contract {
    fn default() -> Self {
        env::panic(b"Contract is not initialized");
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: ValidAccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");

        let mut this = Self {
            owner_id: owner_id.clone().into(),
            accounts: LookupMap::new(b"a".to_vec()),
            total_supply: 10000000,
            account_storage_usage: 0,
            ft_metadata: FungibleTokenMetadata {
                version: "V_1".to_string(),
                name: "Rare".to_string(),
                symbol: "Rare".to_string(),
                icon: "data:image/png;base64,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".to_string(),
                reference: None,
                reference_hash: None,
                decimals: 20
            }
        };
        // Determine cost of insertion into LookupMap
        let initial_storage_usage = env::storage_usage();
        let tmp_account_id = unsafe { String::from_utf8_unchecked(vec![b'a'; 64]) };
        this.accounts.insert(&tmp_account_id, &0u128);
        this.account_storage_usage = env::storage_usage() - initial_storage_usage;
        this.accounts.remove(&tmp_account_id);
        // Make owner have total supply
        let total_supply_u128: u128 = 100000000000000000000000000000000;
        let half_supply_u128: u128 = 50000000000000000000000000000000;
        let staking_account_id: AccountId = String::from("kokumokongz_staking_wallet.near");
        this.accounts.insert(&owner_id.as_ref(), &half_supply_u128);
        this.accounts.insert(&staking_account_id, &half_supply_u128);
        this
    }

    /// Custom Methods

    /// only owner can mint
    pub fn mint(&mut self, amount: U128) {
        assert!(
            env::predecessor_account_id() == self.owner_id,
            "must be owner_id"
        );
        self.total_supply += u128::from(amount);
        let mut balance = self
            .accounts
            .get(&self.owner_id)
            .expect("owner should have balance");
        balance += u128::from(amount);
        self.accounts.insert(&self.owner_id, &balance);
    }
}
