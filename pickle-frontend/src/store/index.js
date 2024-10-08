import { composeWithDevTools } from '@redux-devtools/extension';
import { combineReducers } from "redux";
import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import pbReducer from "./reducers/pbselect";
import dateReducer from "./reducers/dateselect";
import strategyReducer from "./reducers/strategy";
import mydataURLReducer from './reducers/mydataurl';
import stockPricesSlice from './reducers/currentprice';
import pbuserReducer from "./reducers/pbuser"
import presetReducer from './reducers/preset';

export const rootReducer = combineReducers({
    user: userReducer,
    pb: pbReducer,
    date: dateReducer,
    mydataURL: mydataURLReducer,
    stockPrices: stockPricesSlice,
    strategy: strategyReducer,
    pbuser: pbuserReducer,
    preset: presetReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware();
        // middlewares.push(myMiddleware); //커스텀 미들웨어 적용 시
        return middlewares;
      },
});

export default store;