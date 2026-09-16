import { baseApi } from '../../services/baseApi';
import { ENDPOINT_CONSTANTS } from '../../constants/endpoint';

import type {
  CustomerProfile,
} from '../../types';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'delivery';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;

  profile?: CustomerProfile;
  walletBalance?: number;
  coinBalance?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  referralCode?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  profile?: CustomerProfile;
  walletBalance?: number;
  coinBalance?: number;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      LoginResponse,
      LoginRequest
    >({
      query: data => ({
        url: ENDPOINT_CONSTANTS.login,
        method: 'POST',
        body: data,
      }),
    }),

    register: builder.mutation<
      RegisterResponse,
      RegisterRequest
    >({
      query: data => ({
        url: ENDPOINT_CONSTANTS.register,
        method: 'POST',
        body: data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;