import { createStore, applyMiddleware, compose }  from 'redux';
import { createLogger } from 'redux-logger';
import rootReducers from "./reducers";

const loggerMiddleware = createLogger();
const middleware = [];

//  For Redux Dev Tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export default function configureStore(preloadedState) {
    if (process.env.NODE_ENV === 'production') {
        return createStore(
            rootReducers,
            preloadedState,
        );
      } else {
        return createStore(
            rootReducers,
            preloadedState,
            composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
        );
    }
}
