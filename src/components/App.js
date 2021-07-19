import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import { 
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange 
} from '../store/interaction';
import { connect } from 'react-redux';
import { contractsLoadedSelector } from '../store/selectors';

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    try {
      const web3 = await loadWeb3(dispatch);
      await web3.eth.net.getNetworkType();
      const networkId = await web3.eth.net.getId();
      await loadAccount(web3, dispatch);
      const token = await loadToken(web3, networkId, dispatch);
      if (!token) {
        window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.');
        return;
      }
      const exchange = await loadExchange(web3, networkId, dispatch);
      if (!exchange) {
        window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.');
        return;
      }

    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        {/* Add connect button */}
        {this.props.contractsLoaded ? <Content /> : <div className="content"><p className="intro-text">Welcome please connect your wallet</p></div>}
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
