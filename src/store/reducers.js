import { combineReducers } from 'redux';

function web3(state = {}, action) {
    switch (action.type) {
        case 'WEB3_LOADED':
            return { ...state, connection: action.connection };
        case 'WEB3_ACCOUNT_LOADED':
            return { ...state, account: action.account };
        case 'WEB3_CLEARED':
            return {};
        default:
            return state;
    }
}

function token(state = {}, action) {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return { ...state, loaded: true, contract: action.contract };
        case 'TOKEN_CLEARED':
            return {};
        default:
        return state;
    }
}

function exchange(state = {}, action) {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return { ...state, loaded: true, contract: action.contract };
        case 'EXCHANGE_CLEARED':
            return {};
        default:
            return state;
    }
}

const rootReducers = combineReducers({
    web3,
    token,
    exchange
});

export default rootReducers;