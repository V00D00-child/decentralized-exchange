import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import Connection from './Connection';
import { 
  loadWeb3,
  // loadAccount,
  loadToken,
  loadExchange,
  clearWeb3,
  clearToken,
  clearExchange,
  loadWeb3Modal,
  loadAccountWeb3Modal,
  loadBalances,
} from '../store/interaction';
import { connect } from 'react-redux';
import { 
  contractsLoadedSelector,
  accountSelector,
  web3ModalSelector,
  web3ModalProviderSelector,
  web3Selector,
  tokenSelector,
  exchangeSelector
} from '../store/selectors';
import { web3AccountUpdated } from '../store/actions';
let providerCount = 0;

class App extends Component {

  constructor(props) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);
    this.disConnectWallet = this.disConnectWallet.bind(this);
  }

  async componentDidMount() {
    await loadWeb3Modal(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    let provider;

    try {
      const web3 = await loadWeb3(dispatch);
      await web3.eth.net.getNetworkType();
      const networkId = await web3.eth.net.getId();

      const token = await loadToken(web3, networkId, dispatch);
      if (!token) {
        await clearWeb3(dispatch);
        window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.');
        return;
      }
      const exchange = await loadExchange(web3, networkId, dispatch);
      if (!exchange) {
        await clearWeb3(dispatch);
        window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.');
        return;
      }

      // load account with web3Modal
      if (!this.props.web3Modal) {
        await loadWeb3Modal(dispatch);
      }
      
      await this.props.web3Modal.clearCachedProvider();

      // Activate windows with providers (MM and WC) choice
      provider = await this.props.web3Modal.connect();
      providerCount ++;
      await loadAccountWeb3Modal(web3, dispatch, provider);

      // create provider events
      if (providerCount <= 1 ) {
        this.props.provider.on("accountsChanged", async (accounts) => {
          if (!this.props.provider) {
            return;
          }
          if(provider.isMetaMask && provider.selectedAddress !== null){
            await dispatch(web3AccountUpdated(accounts[0]));
  
            // reload balances
            await loadBalances(
              dispatch,
              this.props.web3, 
              this.props.exchange,
              this.props.token, 
              this.props.account
            );
            return;
          } else if (provider.wc){
            await dispatch(web3AccountUpdated(accounts[0]));
  
            // reload balances
            await loadBalances(
              dispatch,
              this.props.web3, 
              this.props.exchange,
              this.props.token, 
              this.props.account
            );
            return;
           }
        });
      
        this.props.provider.on("networkChanged", async (networkId) => {
          if (!this.props.provider) {
            return;
          }
          await this.clearBlockchainData(dispatch);
          window.alert('This exchange only supports transaction on Kovan Test Network please change your network.');
          return;
        });
      }

      // await loadAccount(web3, dispatch);
    } catch(err) {
      console.log("Could not get a wallet connection", err);
      return;
    }

  }

  async clearBlockchainData(dispatch) {
    try {
      if (this.props.provider !== null && this.props.provider.isMetaMask){
        await this.props.provider.close; // Disconnect Web3Modal+MetaMask
      } else if (this.props.provider !== null && this.props.provider.wc) {
        await this.props.provider.stop(); // Disconnect Web3Modal+WalletConnnect (QR code remains)
        await this.props.provider.disconnect();
      }

      // Restart provider session
      await this.props.web3Modal.clearCachedProvider();

      // clear web3 and smart contracts
      await clearWeb3(dispatch);
      await clearToken(dispatch);
      await clearExchange(dispatch);
    } catch(err) {
      console.log("Could not disconnect wallet", err);
    }
  }

  connectWallet() {
    this.loadBlockchainData(this.props.dispatch);
  }

  disConnectWallet() {
    this.clearBlockchainData(this.props.dispatch);
  }

  render() {
    return (
      <div>
        <Navbar disConnectWallet = {this.disConnectWallet} />
        <Connection connectWallet = {this.connectWallet} />
        {this.props.contractsLoaded && this.props.account ? <Content /> : 
        <div className="p-5">
          <h1 className="intro-text text-center">This is a decentralized crypto currency exchange powered by smart contracts</h1>
          <p className="text-center small">(All transaction on this DApp takes place on Kovan test network. This allows you to intract with
            the app without spending real Ether)
          </p>
          <hr></hr>
          <p className="text-left">Exchange smart contract(Kovan Test Network):<a target="_blank" rel="noopener noreferrer" href="https://kovan.etherscan.io/address/0x9d7aE4728A11Cc989d681A549F2660dB596A3941">https://kovan.etherscan.io/address/0x9d7aE4728A11Cc989d681A549F2660dB596A3941</a></p>
          <p className="text-left">DollHair ERC-20 token smart contract(Kovan Test Network):<a target="_blank" rel="noopener noreferrer" href="https://kovan.etherscan.io/address/0x81F22B6fB7D6D63eDEf8c7b321b6a812189Bb5c6">https://kovan.etherscan.io/address/0x81F22B6fB7D6D63eDEf8c7b321b6a812189Bb5c6</a></p>
          <p className="text-left">Trade DollHair Token on Uniswap(Kovan Test Network):<a target="_blank" rel="noopener noreferrer" href="https://app.uniswap.org/#/swap">https://app.uniswap.org/#/swap</a> Token address - 0x81F22B6fB7D6D63eDEf8c7b321b6a812189Bb5c6</p>
          <p>Author: Idris Bowman</p>
          <ul>
            <li>Website: <a target="_blank" rel="noopener noreferrer" href="https://idrisbowman.com">https://idrisbowman.com</a></li>
            <li>Github: <a target="_blank" rel="noopener noreferrer" href="https://github.com/V00D00-child">https://github.com/V00D00-child</a></li>
          </ul>
          <hr></hr>
          <h3  className="text-left">What can you do</h3>
          <ul>
            <li>Trade Ether for DollHair token, or DollHair token for Ether(real-time)</li>
            <li>Deposit Ether</li>
            <li>Deposit DollHair token</li>
            <li>Make buy/sell orders</li>
            <li>Fill open buy/sell order</li>
            <li>Price charts</li>
          </ul>
          <hr></hr>
          <h3  className="intro-text text-left">Technologyies</h3>
          <ul>
            <li>React</li>
            <li>Redux</li>
            <li>Ethereum</li>
            <li>Solidity</li>
            <li>Metamask</li>
            <li>ERC-20</li>
          </ul>
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state),
    account: accountSelector(state),
    web3Modal: web3ModalSelector(state),
    provider : web3ModalProviderSelector(state),
    web3: web3Selector(state),
    token: tokenSelector(state),
    exchange: exchangeSelector(state)
  }
}

export default connect(mapStateToProps)(App);
