import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./userSlice.js";
import chatSlice from "./chatSlice"
import fileSlice from "./fileSlice"
import productSlice from "./productSlice.js";
import ordersSlice from "./orderSlice";

const rootReducer = combineReducers({
    user: userSlice,
    chat:chatSlice,
    file:fileSlice,
    product: productSlice,
    orders: ordersSlice,

});

const persistConfig = {
    key: "root",
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
