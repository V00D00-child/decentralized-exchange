import Web3 from 'web3';
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    web3Cleared,
    tokenCleared,
    exchangeCleared,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled,
    orderFilling,
    orderFilled
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

// WEB3
export const loadWeb3 = (dispatch) => {
    if(window.ethereum) {
        const web3 = new Web3(window.ethereum);
        dispatch(web3Loaded(web3));
        return web3
    } else if (window.web3) {
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

// EXCHANGE
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

// ORDERS
export const loadAllOrders = async (exchange, dispatch) => {
  // Fetch cancel orders with the "Cancel" event stream
  const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest'});
  // Format cancelled orders
  const cancelledOrders = cancelStream.map((event) => event.returnValues);
  // Add cancelled orders to the redux store
  dispatch(cancelledOrdersLoaded(cancelledOrders));
  
  // Fetch filled orders with the "Trade" event stream
  const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest'});
  // Format filled orders
  const filledOrders = tradeStream.map((event) => event.returnValues);
  // Add filled orders to the redux store
  dispatch(filledOrdersLoaded(filledOrders));

  // Fetch all orders with the "Order" event stream
  const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest'});
  // Format filled orders
  const allOrders = orderStream.map((event) => event.returnValues);
  // Add filled orders to the redux store
  dispatch(allOrdersLoaded(allOrders));
}

// CANCEL ORDERS
export const cancelOrder = (dispatch, exchange, order, account) => {
  exchange.methods.cancelOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(orderCancelling());
    })
    .on('error', (error) => {
      console.log(error);
      window.alert('There was an error!');
    });
};

// FILL ORDERS
export const fillOrder = (dispatch, exchange, order, account) => {
  exchange.methods.fillOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(orderFilling());
    })
    .on('error', (error) => {
      console.log(error);
      window.alert('There was an error!');
    });
};

// BLOCKCHAIN EVENTS
export const subscribeToEvents = (exchange, dispatch) => {
  exchange.events.Cancel({}, (error, event) => {
    dispatch(orderCancelled(event.returnValues));
  })

  exchange.events.Trade({}, (error, event) => {
    dispatch(orderFilled(event.returnValues));
  })
};

