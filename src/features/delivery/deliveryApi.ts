import { baseApi } from '../../services/baseApi';

export type DeliveryCustomer = {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
};

export type DeliveryService = {
  _id?: string;
  name?: string;
};

export type DeliveryOrder = {
  _id?: string;
  id?: string;
  orderNumber?: string;

  customer?: DeliveryCustomer;
  service?: DeliveryService;
  serviceName?: string;

  items?: Array<{
    dressType?: string;
    dressName?: string;
    quantity?: number;
    unitPrice?: number;
    lineTotal?: number;
  }>;

  pickupAt?: string;
  expectedDeliveryAt?: string;

  pickupAddress?: string;
  deliveryAddress?: string;

  deliveryPreference?: 'normal' | 'quick';

  subtotal?: number;
  serviceCharge?: number;
  quickDeliveryCharge?: number;
  membershipDiscount?: number;
  coinDiscount?: number;
  coinsUsed?: number;
  coinsEarned?: number;
  finalAmount?: number;

  pickupDeliveryUser?: string;
  dropDeliveryUser?: string;
  deliveryAgent?: string;

  assignedAt?: string;
  assignedBy?: string;

  deliveryAccepted?: boolean;
  deliveryAcceptedAt?: string;

  status: string;

  paymentMethod?: string;
  paymentStatus?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type DeliveryDashboardData = {
  stats: {
    pickups: number;
    deliveries: number;
    completed: number;
    todayCompleted: number;
  };

  activeOrders: DeliveryOrder[];
};

type DashboardResponse = {
  success: boolean;
  data: DeliveryDashboardData;
};

type OrdersResponse = {
  success: boolean;
  count: number;
  data: DeliveryOrder[];
};

type UpdateStatusResponse = {
  success: boolean;
  message: string;
  data: DeliveryOrder;
};

export const deliveryApi = baseApi.injectEndpoints({
  endpoints: build => ({
    deliveryDashboard: build.query<
      DeliveryDashboardData,
      void
    >({
      query: () => '/delivery/dashboard',

      transformResponse: (
        response: DashboardResponse,
      ) => response.data,

      providesTags: ['Delivery'],
    }),

    deliveryPickups: build.query<
      DeliveryOrder[],
      void
    >({
      query: () => '/delivery/pickups',

      transformResponse: (
        response: OrdersResponse,
      ) => response.data || [],

      providesTags: ['Delivery'],
    }),

    activeDeliveries: build.query<
      DeliveryOrder[],
      void
    >({
      query: () => '/delivery/orders/active',

      transformResponse: (
        response: OrdersResponse,
      ) => response.data || [],

      providesTags: ['Delivery'],
    }),

    deliveryHistory: build.query<
      DeliveryOrder[],
      void
    >({
      query: () => '/delivery/history',

      transformResponse: (
        response: OrdersResponse,
      ) => response.data || [],

      providesTags: ['Delivery'],
    }),

    updateDeliveryStatus: build.mutation<
      DeliveryOrder,
      {
        orderId: string;
        status:
        | 'OUT_FOR_PICKUP'
        | 'PICKED_UP'
        | 'OUT_FOR_DELIVERY'
        | 'DELIVERED';
      }
    >({
      query: ({ orderId, status }) => ({
        url: `/delivery/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),

      transformResponse: (
        response: UpdateStatusResponse,
      ) => response.data,

      invalidatesTags: ['Delivery', 'Orders'],
    }),
    acceptDelivery: build.mutation<
      DeliveryOrder,
      string
    >({
      query: orderId => ({
        url: `/delivery/orders/${orderId}/accept`,
        method: 'PATCH',
      }),

      transformResponse: (
        response: UpdateStatusResponse,
      ) => response.data,

      invalidatesTags: ['Delivery', 'Orders'],
    }),
  }),
});

export const {
  useDeliveryDashboardQuery,
  useDeliveryPickupsQuery,
  useActiveDeliveriesQuery,
  useDeliveryHistoryQuery,
  useAcceptDeliveryMutation,
  useUpdateDeliveryStatusMutation,
} = deliveryApi;