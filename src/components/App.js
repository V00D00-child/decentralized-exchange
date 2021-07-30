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

  componentDidMount() {
    // Dev mode
    this.loadBlockchainData(this.props.dispatch);
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
        {this.props.contractsLoaded ? <Content /> : <div className=""><h1 className="intro-text text-center">Welcome please connect your wallet</h1></div>}
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
