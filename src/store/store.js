import { createStore, compose, applyMiddleware } from "redux";
import rootreducer from './reducer/CombineReducer'
import { persistStore } from "redux-persist";
import thunk from 'redux-thunk';


const enhancer = compose(applyMiddleware(thunk));
const initialState = {};

let store = createStore(rootreducer, initialState, enhancer);

let persistor = persistStore(store);

export { store, persistor };

















// Reux persist Code:
// const enhancer = compose(applyMiddleware(thunk));
// const initialState = {};
// const persistedReducer = persistReducer(persistConfig, reducer);

// let store = createStore(persistedReducer, initialState, enhancer);
// let persistor = persistStore(store);

// export { store, persistor };