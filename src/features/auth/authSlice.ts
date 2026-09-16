import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type {
  CustomerProfile,
  Role,
  User,
} from '../../types';

import {
  setInMemoryToken,
} from '../../services/baseApi';

interface AuthState {
  token: string | null;
  role: Role | null;
  user: User | null;
  profile: CustomerProfile | null;
  walletBalance: number;
  coinBalance: number;
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  user: null,
  profile: null,
  walletBalance: 0,
  coinBalance: 0,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setSession: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
        profile?: CustomerProfile;
        walletBalance?: number;
        coinBalance?: number;
      }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.user.role;

      state.profile =
        action.payload.profile ?? null;

      state.walletBalance =
        action.payload.walletBalance ?? 0;

      state.coinBalance =
        action.payload.coinBalance ?? 0;

      state.hydrated = true;

      setInMemoryToken(
        action.payload.token,
      );
    },

    setBalances: (
      state,
      action: PayloadAction<{
        walletBalance?: number;
        coinBalance?: number;
      }>,
    ) => {
      if (
        action.payload.walletBalance !== undefined
      ) {
        state.walletBalance =
          action.payload.walletBalance;
      }

      if (
        action.payload.coinBalance !== undefined
      ) {
        state.coinBalance =
          action.payload.coinBalance;
      }
    },

    setProfile: (
      state,
      action: PayloadAction<
        CustomerProfile | null
      >,
    ) => {
      state.profile = action.payload;
    },

    markHydrated: state => {
      state.hydrated = true;
    },

    logout: state => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.profile = null;
      state.walletBalance = 0;
      state.coinBalance = 0;
      state.hydrated = true;

      setInMemoryToken(null);
    },
  },
});

export const {
  setSession,
  setBalances,
  setProfile,
  markHydrated,
  logout,
} = authSlice.actions;

export const authReducer =
  authSlice.reducer;