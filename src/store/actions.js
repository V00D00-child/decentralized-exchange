
// WEB3
export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3ModalLoaded(web3Modal) {
    return {
        type: 'WEB3_MODAL_LOADED',
        web3Modal
    }
}

export function web3AccountLoaded(account, networkId) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account,
        networkId
    }
}

export function web3ModalAccountLoaded(account, networkId, provider) {
    return {
        type: 'WEB3_MODAL_ACCOUNT_LOADED',
        account,
        networkId,
        provider
    }
}

export function web3AccountUpdated(account) {
    return {
        type: 'WEB3_ACCOUNT_UPDATED',
        account,
    }
}

export function web3Cleared() {
    return {
        type: 'WEB3_CLEARED'
    }
}

// TOKEN
export function tokenLoaded(contract) {
    return {
        type: 'TOKEN_LOADED',
        contract
    }
}

export function tokenCleared() {
    return {
        type: 'TOKEN_CLEARED'
    }
}

// EXCHANGE
export function exchangeLoaded(contract) {
    return {
        type: 'EXCHANGE_LOADED',
        contract
    }
}

export function exchangeCleared() {
    return {
        type: 'EXCHANGE_CLEARED'
    }
}

export function cancelledOrdersLoaded(cancelledOrders) {
    return {
        type: 'CANCELLED_ORDERS_LOADED',
        cancelledOrders
    }
}

export function filledOrdersLoaded(filledOrders) {
    return {
        type: 'FILLED_ORDERS_LOADED',
        filledOrders
    }
}

export function allOrdersLoaded(allOrders) {
    return {
        type: 'ALL_ORDERS_LOADED',
        allOrders
    }
}

// CANCELLING ORDERS
export function orderCancelling() {
    return {
        type: 'ORDER_CANCELLING'
    }
}

export function orderCancelled(order) {
    return {
        type: 'ORDER_CANCELLED',
        order
    }
}

// FILLING ORDERS
export function orderFilling() {
    return {
        type: 'ORDER_FILLING'
    }
}

export function orderFilled(order) {
    return {
        type: 'ORDER_FILLED',
        order
    }
}

// BALANCES
export function etherBalanceLoaded(balance) {
    return {
        type: 'ETHER_BALANCE_LOADED',
        balance
    }
}

export function tokenBalanceLoaded(balance) {
    return {
        type: 'TOKEN_BALANCE_LOADED',
        balance
    }
}

export function exchangeEtherBalanceLoaded(balance) {
    return {
        type: 'EXCHANGE_ETHER_BALANCE_LOADED',
        balance
    }
}

export function exchangeTokenBalanceLoaded(balance) {
    return {
        type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
        balance
    }
}

export function balancesLoading() {
    return {
        type: 'BALANCES_LOADING'
    }
}

export function balancesLoaded() {
    return {
        type: 'BALANCES_LOADED'
    }
}

// DEPOSITING
export function etherDepositAmountChanged(amount) {
    return {
        type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

export function tokenDepositAmountChanged(amount) {
    return {
        type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

// WITHDRAWING
export function etherWithdrawAmountChanged(amount) {
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

export function tokenWithdrawAmountChanged(amount) {
    return {
        type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

// GENERIC ORDER
export function orderMade(order) {
    return {
        type: 'ORDER_MADE',
        order
    }
}

// BUY ORDER
export function buyOrderAmountChanged(amount) {
    return {
        type: 'BUY_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function buyOrderPriceChanged(price) {
    return {
        type: 'BUY_ORDER_PRICE_CHANGED',
        price
    }
}

export function buyOrderMaking() {
    return {
        type: 'BUY_ORDER_MAKING'
    }
}

// SELL ORDER
export function sellOrderAmountChanged(amount) {
    return {
        type: 'SELL_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function sellOrderPriceChanged(price) {
    return {
        type: 'SELL_ORDER_PRICE_CHANGED',
        price
    }
}

export function sellOrderMaking() {
    return {
        type: 'SELL_ORDER_MAKING'
    }
}


