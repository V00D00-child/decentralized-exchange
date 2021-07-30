
// WEB3
export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
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

// WITHDRAWING
export function etherWithdrawAmountChanged(amount) {
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}




