import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import Connection from './Connection';
import { 
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange,
  clearWeb3,
  clearToken,
  clearExchange,
} from '../store/interaction';
import { connect } from 'react-redux';
import { contractsLoadedSelector } from '../store/selectors';

class App extends Component {

  constructor(props) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);
    this.disConnectWallet = this.disConnectWallet.bind(this);
  }

  async loadBlockchainData(dispatch) {
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
      await loadAccount(web3, dispatch);
    } catch(err) {
      console.log(err);
    }
  }

  async clearBlockchainData(dispatch) {
    try {
      await clearWeb3(dispatch);
      await clearToken(dispatch);
      await clearExchange(dispatch);
    } catch(err) {
      console.log(err);
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
        {this.props.contractsLoaded ? <Content /> : 
        <div className="p-5">
          <h1 className="intro-text text-center">This is a crypto currency exchange powered by smart contracts</h1>
          <p className="text-center small">(All transaction on this DApp takes place on Kovan test network. This allows you to intract with
            the app without spending real Ether)
          </p>
          <hr></hr>
          <p className="text-left">Exchange smart contract(Kovan Test Network):<a target="_blank" rel="noopener noreferrer" href="https://kovan.etherscan.io/">https://kovan.etherscan.io/</a></p>
          <p className="text-left">DollHair ERC-20 token smart contract(Kovan Test Network):<a target="_blank" rel="noopener noreferrer" href="https://kovan.etherscan.io/">https://kovan.etherscan.io/</a></p>
          <p>Author: Idris Bowman</p>
          <ul>
            <li>Website: <a target="_blank" rel="noopener noreferrer" href="https://idrisbowman.com">https://idrisbowman.com</a></li>
            <li>Github: <a target="_blank" rel="noopener noreferrer" href="https://github.com/dris1995 ">https://github.com/dris1995 </a></li>
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
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);
