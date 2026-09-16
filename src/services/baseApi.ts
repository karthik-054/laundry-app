import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '../constants/environment';

let inMemoryToken: string | null = null;

export const setInMemoryToken = (
  token: string | null,
) => {
  inMemoryToken = token;
};

export const getInMemoryToken = () => {
  return inMemoryToken;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: headers => {
    if (inMemoryToken) {
      headers.set(
        'Authorization',
        `Bearer ${inMemoryToken}`,
      );
    }

    headers.set(
      'Content-Type',
      'application/json',
    );

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: rawBaseQuery,

  tagTypes: [
    'Session',
    'Admin',
    'Delivery',
    'Notifications',
    'Support',
    'Reviews',
    'Wallet',
    'Coins',
    'Catalog',
    'Orders',
    'Payments',
    'Reviews'
  ],

  endpoints: () => ({}),
});