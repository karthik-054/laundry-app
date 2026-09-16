import { baseApi } from '../../services/baseApi';

import type {
  CoinTxn,
  PaymentRecord,
  SessionPayload,
  WalletTxn,
} from '../../types';


// ==============================================
// WALLET API
// ==============================================

export const walletApi = baseApi.injectEndpoints({
  endpoints: build => ({

    wallet: build.query<
      {
        balance: number;
        transactions: WalletTxn[];
      },
      void
    >({

      query: () => '/wallet',

      providesTags: ['Wallet'],
    }),

  }),
});


// ==============================================
// COIN API
// ==============================================

export const coinApi = baseApi.injectEndpoints({
  endpoints: build => ({

    coins: build.query<
      {
        balance: number;
        earned: number;
        redeemed: number;
        transactions: CoinTxn[];
      },
      void
    >({

      query: () => '/coins',

      providesTags: ['Coins'],
    }),

  }),
});


// ==============================================
// PAYMENT API
// ==============================================

export const paymentApi = baseApi.injectEndpoints({
  endpoints: build => ({

    payments: build.query<
      PaymentRecord[],
      void
    >({

      query: () => '/payments',

      providesTags: ['Payments'],
    }),


    createRazorpayOrder:
      build.mutation<
        {
          razorpayOrderId: string;
          amount: number;
          currency: string;
          keyId: string;
          mock: boolean;
        },

        {
          purpose:
            | 'wallet'
            | 'order';

          amount?: number;

          orderId?: string;
        }
      >({

        query: body => ({
          url:
            '/payments/razorpay/order',

          method: 'POST',

          body,
        }),
      }),


    verifyRazorpay:
      build.mutation<
        SessionPayload,

        {
          razorpayOrderId: string;

          razorpayPaymentId: string;

          razorpaySignature?: string;
        }
      >({

        query: body => ({
          url:
            '/payments/razorpay/verify',

          method: 'POST',

          body,
        }),

        invalidatesTags: [
          'Wallet',
          'Coins',
          'Payments',
          'Orders',
          'Session',
        ],
      }),

  }),
});


// ==============================================
// EXPORT HOOKS
// ==============================================

export const {
  useWalletQuery,
} = walletApi;


export const {
  useCoinsQuery,
} = coinApi;


export const {
  usePaymentsQuery,

  useCreateRazorpayOrderMutation,

  useVerifyRazorpayMutation,

} = paymentApi;