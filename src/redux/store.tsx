import { configureStore, combineReducers } from '@reduxjs/toolkit';

import sidebarSlice from './reducers/sidebarSlice';
import userSlice from './reducers/userSlice';

import { setupListeners } from '@reduxjs/toolkit/query/react'; // Added this import

import { expensesAPI } from './reducers/api/expensesAPI';
import { incomeAPI } from './reducers/api/incomeAPI';
import { userAPI } from './reducers/api/userAPI';
import { messagesAPI } from './reducers/api/messagesAPI';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducer = combineReducers({
    sidebar: sidebarSlice,
    user: userSlice,
    [expensesAPI.reducerPath]: expensesAPI.reducer, 
    [incomeAPI.reducerPath]: incomeAPI.reducer, 
    [userAPI.reducerPath]: userAPI.reducer, 
    [messagesAPI.reducerPath]: messagesAPI.reducer, 
})

const persistConfig = {
  key: 'root',
  storage, // Specify the storage engine
  // You can add more configuration options here
  blacklist: [expensesAPI.reducerPath, incomeAPI.reducerPath, userAPI.reducerPath, messagesAPI.reducerPath], // Exclude these slices from persistence
};

const persistedReducer = persistReducer(persistConfig, reducer);

const configStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(expensesAPI.middleware, incomeAPI.middleware, userAPI.middleware, messagesAPI.middleware),
})

setupListeners(configStore.dispatch); // Setup RTK-Query listeners

const persistor = persistStore(configStore);

export { configStore, persistor };