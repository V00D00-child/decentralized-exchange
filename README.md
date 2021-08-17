# Decentralized Cryptocurrency Exchange (TRADE, DEPOSIT, WITHDRAW !!:gem: :gem:)
## Powered by Ethereum smart contracts. Currently deployed to Kovan test network

## Features
- Trade Ether for DollHair token, or DollHair token for Ether(real-time)
- Deposit Ether
- Deposit DollHair token
- Make buy/sell orders
- Fill open buy/sell order
- Price charts


## Smart Contracts Overview
- Exchange - This is the smart contract that wholes logic to make/fill orders, deposit/withdraw funds. It also holds fees(10%) for each trade that is made on the exchange.
- DollHair Token - This is my own personal ERC-20 token I create to trade on this exchange.


## Verified smart contracts( Kovan test network)
- Exchange - https://kovan.etherscan.io/address/0x9d7aE4728A11Cc989d681A549F2660dB596A3941
- DollHair Token - https://kovan.etherscan.io/address/0x81F22B6fB7D6D63eDEf8c7b321b6a812189Bb5c6


## View live (Kovan test network)
You will need Ether on Kovan test network to use app
- get ether for test network: https://app.mycrypto.com/faucet
- https://exchange.idrisbowman.com/


## Set up to run locally
1. npm install
2. Install Ganache and start it up locally(this is our local blockchain network)
3. Connect MetaMask to local blockchain network and import private keys of 1st and 2nd address in Ganache(note: we need to accounts to make trades, one account makes an order and the other account fills that order)
4. Run smart contract deployment script "npm run deploy:contract:dev" (this script will deploy smart contracts to local blockchain and overwrite any exist contracts)
5. Run script to seed exchange(this will prefill the app with data) "npm run seed:script:dev"
6. Start React app "npm run start"
7. Import local token address into Metmask
8. Go to localhost:3000/ in the browser
9. Connect wallet, make trades

## Testing smart contracts
"npm run test:contract"


## Tech stack
- infura (blockchain node) - https://infura.io/
- MetaMask (crypto wallet) - https://metamask.io/
- truffle (used to compile, test, debug and deploy smart contracts) - https://www.trufflesuite.com/docs/truffle/overview
- web3 (Javascript API that interacts with a local or remote ethereum node using HTTP) - https://web3js.readthedocs.io/en/v1.3.4/
- Ganache (local development blockchain) https://www.trufflesuite.com/ganache
- ReactJS (clients side app)
- React-redux (client side state managment)
- Kovan - test network for smart contracts
