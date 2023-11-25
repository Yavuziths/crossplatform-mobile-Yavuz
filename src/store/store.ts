import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";

import { postsApi } from "./api/postsApi";
import { usersApi } from "./api/usersApi";
import authSlice from "./slices/authSlice";
import configSlice from "./slices/configSlice";
import { initializeI18n } from "../../i18n";

const rootReducer = combineReducers({
  [postsApi.reducerPath]: postsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  auth: authSlice,
  config: configSlice,

});

export type RootState = ReturnType<typeof rootReducer>;

const middlewares = [usersApi.middleware, postsApi.middleware];

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const persistConfig = {
  key: "crossplatform-mobile-v1.0.0",
  storage: AsyncStorage,
  whitelist: ["auth", "config", postsApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }).concat(...middlewares),
});

export const persistor = persistStore(store, null, () => {
  const state = store.getState();
  console.log("Rehydrated state:", state);
  initializeI18n(state.config.locale);
});

setupListeners(store.dispatch);
