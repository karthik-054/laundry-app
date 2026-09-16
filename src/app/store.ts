import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { baseApi } from '../services/baseApi';
import { authReducer } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch =
  useDispatch.withTypes<AppDispatch>();

export const useAppSelector =
  useSelector.withTypes<RootState>();