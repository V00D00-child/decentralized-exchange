
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

// TODO: Stop at 13:57
export function cancelledOrdersLoaded(cancelledOrders) {
    return {
        type: 'CANCELLED_ORDERS',
        cancelledOrders
    }
}


