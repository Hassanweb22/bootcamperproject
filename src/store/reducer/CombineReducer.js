import { combineReducers } from 'redux'
import TaskReducer from './taskReducer';

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    task: TaskReducer,
})
export default persistReducer(persistConfig, rootReducer)