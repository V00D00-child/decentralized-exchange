require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privatekeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1", 
     port: 7545,
     network_id: "*",
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          // Private key
          privatekeys.split(','), // Array of account private keys
          // Url to an Ethereum Node
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}` // Url to an Ethereum Node
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      solc: {
        optimizer: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        }
      }
    },
  },
};
