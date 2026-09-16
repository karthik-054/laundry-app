import { baseApi } from '../../services/baseApi';

import type {
  Order,
  Quote,
} from '../../types';


type QuoteApiResponse = {
  success: boolean;

  service: {
    id: string;
    name: string;
  };

  items: {
    dressTypeId: string;
    dressName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];

  subtotal: number;

  serviceCharge: number;

  quickDeliveryCharge: number;

  membershipDiscount: number;

  coinsToRedeem: number;

  coinDiscount: number;

  finalAmount: number;

  expectedDeliveryAt: string;

  coinsEarned: number;
};


type OrderApiResponse = {
  success: boolean;

  message?: string;

  data: Order;
};


type OrdersApiResponse = {
  success: boolean;

  count: number;

  data: Order[];
};

type InvoiceItem = {
  dressTypeId: string;
  dressName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type InvoiceSnapshot = {
  businessName: string;
  invoiceNumber: string;
  orderNumber: string;
  orderId: string;
  date?: string;

  customer: string;
  customerPhone?: string;
  customerEmail?: string;

  address?: string;
  landmark?: string;

  serviceName: string;
  deliveryPreference: string;

  items: InvoiceItem[];

  subtotal: number;
  serviceCharge: number;
  quickDeliveryCharge: number;
  membershipDiscount: number;

  coinsUsed: number;
  coinDiscount: number;

  finalAmount: number;

  pickupAt?: string;
  expectedDeliveryAt?: string;

  paymentMethod: string;
  paymentStatus: string;

  coinsEarned: number;

  status: string;
};

type InvoiceApiResponse = {
  success: boolean;
  data: {
    snapshot: InvoiceSnapshot;
  };
};


export const orderApi =
  baseApi.injectEndpoints({

    endpoints: build => ({

      // ========================================
      // QUOTE
      // ========================================

      quoteOrder:
        build.mutation<
          Quote,

          {
            serviceId: string;

            items: {
              dressTypeId: string;
              quantity: number;
            }[];

            deliveryPreference:
              'normal' | 'quick';

            coinsToRedeem: number;

            pickupAt: string;
          }
        >({

          query: body => ({
            url: '/orders/quote',

            method: 'POST',

            body,
          }),

          transformResponse:
            (
              response:
                QuoteApiResponse,
            ): Quote => ({

              items:
                response.items,

              subtotal:
                response.subtotal,

              serviceCharge:
                response.serviceCharge,

              quickDeliveryCharge:
                response.quickDeliveryCharge,

              membershipDiscount:
                response.membershipDiscount,

              coinDiscount:
                response.coinDiscount,

              coinsUsed:
                response.coinsToRedeem,

              coinsEarned:
                response.coinsEarned,

              finalAmount:
                response.finalAmount,

              expectedDeliveryAt:
                response.expectedDeliveryAt,
            }),
        }),


      // ========================================
      // PLACE ORDER
      // ========================================

      placeOrder:
        build.mutation<

          Order,

          {
            serviceId: string;

            items: {
              dressTypeId: string;
              quantity: number;
            }[];

            deliveryPreference:
              'normal' | 'quick';

            coinsToRedeem: number;

            pickupAt: string;

            paymentMethod:
              | 'razorpay'
              | 'wallet'
              | 'cod'
              | 'wallet_razorpay';

            walletAmount?: number;
          }
        >({

          query: body => ({
            url: '/orders',

            method: 'POST',

            body,
          }),

          transformResponse:
            (
              response:
                OrderApiResponse,
            ): Order =>
              response.data,

          // ----------------------------------
          // VERY IMPORTANT
          // ----------------------------------

          invalidatesTags: [
            'Orders',
            'Wallet',
            'Coins',
            'Session',
            'Payments',
          ],
        }),


      // ========================================
      // MY ORDERS
      // ========================================

      orders:
        build.query<
          Order[],
          void
        >({

          query: () =>
            '/orders/my-orders',

          transformResponse:
            (
              response:
                OrdersApiResponse,
            ) =>
              response.data,

          providesTags: [
            'Orders',
          ],
        }),


      // ========================================
      // SINGLE ORDER
      // ========================================

      order:
        build.query<
          Order,
          string
        >({

          query: id =>
            `/orders/${id}`,

          transformResponse:
            (
              response:
                OrderApiResponse,
            ) =>
              response.data,

          providesTags: [
            'Orders',
          ],
        }),


      // ========================================
      // INVOICE
      // ========================================

      invoice:
        build.query<
          {
            snapshot:
              Record<
                string,
                unknown
              >;
          },

          string
        >({

          query: orderId =>
            `/invoices/${orderId}`,
          transformResponse:
      (
        response: InvoiceApiResponse,
      ) => response.data,
        }),

    }),
  });

  export const {
  useQuoteOrderMutation,
  usePlaceOrderMutation,
  useOrdersQuery,
  useOrderQuery,
  useInvoiceQuery,
} = orderApi;