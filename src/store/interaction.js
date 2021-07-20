import Web3 from 'web3';
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    web3Cleared,
    tokenCleared,
    exchangeCleared
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

// WEB3
/*
if(typeof window.ethereum!=='undefined'){
        const web3 = new Web3(window.ethereum)
        dispatch(web3Loaded(web3))
        return web3
    }
*/
export const loadWeb3 = (dispatch) => {
    if(window.ethereum) {
      console.log('new');
        const web3 = new Web3(window.ethereum);
        dispatch(web3Loaded(web3));
        return web3
    } else if (window.web3) {
      console.log('old');
      const web3 = new Web3(window.web3.currentProvider)
      dispatch(web3Loaded(web3));
      return web3
    } else {
      window.alert('Please install MetaMask');
      window.open('https://metamask.io/index.html', '_blank');
    }
}

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account =  accounts[0];
    if(typeof account !== 'undefined') {
      dispatch(web3AccountLoaded(account));
      return account
    } else {
      window.alert('Please login with MetaMask');
      return null;
    }
}

export const clearWeb3 = (dispatch) => {
  dispatch(web3Cleared())
  return null;
}

// TOKEN
export const loadToken = async (web3, networkId, dispatch) => {
    try {
      const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
      dispatch(tokenLoaded(token));
      return token;
    } catch (error) {
      return null;
    }
}

export const clearToken = (dispatch) => {
  dispatch(tokenCleared())
  return null;
}

// Exchange
export const loadExchange = async (web3, networkId, dispatch) => {
    try {
      const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
      dispatch(exchangeLoaded(exchange));
      return exchange;
    } catch (error) {
      return null
    }
}

export const clearExchange = (dispatch) => {
  dispatch(exchangeCleared())
  return null;
}