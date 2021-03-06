import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {
    web3Loaded,
    web3AccountLoaded,
    web3ModalAccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    web3Cleared,
    web3ModalLoaded,
    tokenCleared,
    exchangeCleared,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled,
    orderFilling,
    orderFilled,
    etherBalanceLoaded,
    tokenBalanceLoaded,
    exchangeEtherBalanceLoaded,
    exchangeTokenBalanceLoaded,
    balancesLoaded,
    balancesLoading,
    buyOrderMaking,
    sellOrderMaking,
    orderMade
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import { ETHER_ADDRESS, formatBalance} from '../helpers';

// WEB3
export const loadWeb3 = (dispatch) => {
    if(window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
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

export const loadWeb3Modal = (dispatch) => {
  /** Settings for:
    *   Web3Modal+WalletConnect 
    *   Web3Modal+MetaMask,
    *   MetaMask.
  */
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_API_KEY,
      }
    }
  };

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // Declare MetaMask
  });
  dispatch(web3ModalLoaded(web3Modal));
}

export const loadAccountWeb3Modal = async (web3, dispatch, provider) => {
  let account, networkId;
  if(provider.isMetaMask){ // When MetaMask was chosen as a provider
    web3 = new Web3(provider);
    account = provider.selectedAddress;
    networkId = await web3.eth.net.getId();

    if(typeof account !== 'undefined') {
      dispatch(web3ModalAccountLoaded(account, networkId, provider));
      return account
    } else {
      window.alert('Please login with MetaMask or make sure your account is connected to our app');
      return null;
    }
  } else if (provider.wc) { 
    console.log('using wallet connect')
    account = await provider.accounts[0];
    web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`));
    
    if(typeof account !== 'undefined') {
      dispatch(web3ModalAccountLoaded(account, networkId, provider));
      return account
    } 
  } else {
    window.alert('Error, provider not recognized')
  }
}

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account =  accounts[0];
  const networkId = await web3.eth.net.getId();

  if(typeof account !== 'undefined') {
    dispatch(web3AccountLoaded(account, networkId));
    return account
  } else {
    window.alert('Please login with MetaMask or make sure your account is connected to our app');
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
      console.log('There was an error canceling your order please refresh page!', error);
      window.alert('There was an error canceling your order please refresh page!');
    });
};

// FILL ORDERS
export const fillOrder = async (dispatch, exchange,token, order, account) => {
  const orderFillerExchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
  const orderFillerExchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
  const orderMakerExchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, order.user).call();
  const orderMakerExchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, order.user).call();
  const exchangeFee = (formatBalance(order.amountGet) * .10);

  // don't allow order maker to fill own order
  if (account.toLowerCase() === order.user.toLowerCase()) {
    window.alert('You cannot fill a order that you created.');
    return;
  }

  // Check trader exchange balance before making any trades
  if (order.orderFilledAction === 'sell') {
    // Make sure order filler has enough DollHair tokens deposited to make trade for Ether
    if ((formatBalance(order.amountGet) + exchangeFee) > formatBalance(orderFillerExchangeTokenBalance)) {
      window.alert('You do not have enough DollHiar tokens deposited to make this trade.');
      return;
    }

    // Make sure order maker has enough Ether deposited to make trade
    if ((formatBalance(order.amountGive)) > formatBalance(orderMakerExchangeEtherBalance)) {
      window.alert('The order maker does not have Ether deposited to make this trade.');
      return;
    }
  } else if (order.orderFilledAction === 'buy') {
    // Make sure order filler has enough Ether deposited to make trade for DollHair
    if ((formatBalance(order.amountGet) + exchangeFee) > formatBalance(orderFillerExchangeEtherBalance)) {
      window.alert('You do not have enough Ether deposited to make this trade for DollHair token. Please deposit more Eth.');
      return;
    }

    // Make sure order maker has enough DollHair tokens deposited to make trade
    if (formatBalance(order.amountGive) > formatBalance(orderMakerExchangeTokenBalance)) {
      window.alert('The order maker does not have enough DollHair token deposited to make this trade.');
      return;
    }
  }

  exchange.methods.fillOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(orderFilling());
    })
    .on('error', (error) => {
      if (error.code === 4001) {
        return;
      } else {
        window.alert('There was an error filling your order please refresh page!');
      }
    });
};

// BLOCKCHAIN EVENTS
export const subscribeToEvents = (exchange, dispatch, web3, token, account) => {
  exchange.events.Cancel({}, (error, event) => {
    dispatch(orderCancelled(event.returnValues));
  });

  exchange.events.Trade({}, (error, event) => {
    dispatch(orderFilled(event.returnValues));
    loadBalances(dispatch, web3, exchange, token, account);
  });

  exchange.events.Deposit({}, (error, event) => {
    dispatch(balancesLoaded());
    loadBalances(dispatch, web3, exchange, token, account);
  });

  exchange.events.Withdraw({}, (error, event) => {
    dispatch(balancesLoaded());
    loadBalances(dispatch, web3, exchange, token, account);
  });

  exchange.events.Order({}, (error, event) => {
    dispatch(orderMade(event.returnValues));
  });
};

// BALANCES
export const loadBalances = async (dispatch, web3, exchange, token, account) => {
  if(typeof account !== 'undefined') {
    // Ether balance in wallet
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    // Token balance in wallet
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));

    // Ether balance in exchange
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    // Token balance in exchange
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    // Trigger all balances loaded
    dispatch(balancesLoaded());
  } else {
    window.alert('Please login with MetaMask');
  }
};

// DEPOSITING
export const depositEther = (dispatch, exchange, web3, token, amount, account) => {
  exchange.methods.depositEther().send({ from: account,  value: web3.utils.toWei(amount, 'ether') })
  .on('transactionHash', (hash) => {
    dispatch(balancesLoading());
  })
  .on('error',(error) => {
    console.log('There was an error when depositing Ether please refresh page!', error)
    window.alert('There was an error when depositing Ether please refresh page!');
  })
};

export const depositToken = async (dispatch, exchange, web3, token, amount, account) => {
  amount = web3.utils.toWei(amount, 'ether');

  token.methods.approve(exchange.options.address, amount).send({ from: account })
  .on('transactionHash', (hash) => {
    exchange.methods.depositToken(token.options.address, amount).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(balancesLoading());
    })
  })
    .on('error',(error) => {
      console.log('There was an error when depositing DollHair tokens please refresh page!', error)
      window.alert('There was an error when depositing DollHair tokens please refresh page!');
    })
};

// WITHDRAWLING
export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({ from: account})
  .on('transactionHash', (hash) => {
    dispatch(balancesLoading());
  })
  .on('error',(error) => {
    console.log('There was an error when withdrawing Ether tokens please refresh page!', error)
    window.alert('There was an error when withdrawing Ether tokens please refresh page!');
  })
};

export const withdrawToken = (dispatch, exchange, web3, token, amount, account) => {
  exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({ from: account})
  .on('transactionHash', (hash) => {
    dispatch(balancesLoading());
  })
  .on('error',(error) => {
    console.console('There was an error when withdrawing DollHair tokens please refresh page!', error)
    window.alert('There was an error when withdrawing DollHair tokens please refresh page!');
  })
};

// MAKING ORDERS
export const makeBuyOrder = (dispatch, exchange, token, web3, order, account) => {
  // Always buy order when you are giving ether and getting Dollhair tokens
  const tokenGet = token.options.address;
  const ammountGet = web3.utils.toWei(order.amount, 'ether');
  const tokenGive = ETHER_ADDRESS;
  const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether');

  exchange.methods.makeOrder(tokenGet, ammountGet, tokenGive, amountGive).send({ from: account})
  .on('transactionHash', (hash) => {
    dispatch(buyOrderMaking());
  })
  .on('error',(error) => {
    console.log('There was an error when making your order please refresh page!', error)
    window.alert('There was an error when making buy order please refresh page!');
  })
};

export const makeSellOrder = (dispatch, exchange, token, web3, order, account) => {
  const tokenGet = ETHER_ADDRESS;
  const ammountGet =  web3.utils.toWei((order.amount * order.price).toString(), 'ether');
  const tokenGive = token.options.address;
  const amountGive = web3.utils.toWei(order.amount, 'ether');

  exchange.methods.makeOrder(tokenGet, ammountGet, tokenGive, amountGive).send({ from: account})
  .on('transactionHash', (hash) => {
    dispatch(sellOrderMaking());
  })
  .on('error',(error) => {
    console.log('There was an error when making sell order please refresh page!', error)
    window.alert('There was an error when making sell order please refresh page!');
  })
};