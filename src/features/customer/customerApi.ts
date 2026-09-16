import { baseApi } from '../../services/baseApi';

import {
  ENDPOINT_CONSTANTS,
} from '../../constants/endpoint';


// ==========================================
// SERVICE REQUEST TYPES
// ==========================================

export type ServiceRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export type ServiceRequest = {
  _id: string;

  customer:
  | string
  | {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };

  name: string;
  phone: string;
  email: string;

  address: string;
  landmark: string;
  city: string;
  pincode: string;

  status: ServiceRequestStatus;

  approvedBy?: string | null;
  approvedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type ServiceRequestResponse = {
  success: boolean;
  message?: string;
  request: ServiceRequest;
};

export type SubmitServiceRequestPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
};


// ==========================================
// CUSTOMER DASHBOARD TYPES
// ==========================================

export type CustomerProfile = {
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
};

export type DashboardWallet = {
  balance: number;
};

export type DashboardCoin = {
  balance: number;
};

export type DashboardOrder = {
  _id: string;

  orderNumber: string;

  status: string;

  pickupDate?: string;

  deliveryDate?: string;

  expectedDeliveryAt?: string;

  totalAmount?: number;

  finalAmount?: number;

  serviceName?: string;

  createdAt?: string;
};

export type DashboardService = {
  _id: string;

  name: string;

  description?: string;

  price?: number;

  image?: string;

  category?: string;

  isPopular?: boolean;
};

export type DashboardAdvertisement = {
  _id: string;

  title?: string;

  description?: string;

  image?: string;

  bannerImage?: string;

  isActive?: boolean;
};


// ==========================================
// CUSTOMER DASHBOARD RESPONSE
// ==========================================

export type CustomerDashboardResponse = {
  success: boolean;

  message?: string;

  data: {
    profile: CustomerProfile | null;

    wallet: DashboardWallet;

    coins: DashboardCoin;

    activeOrders: DashboardOrder[];

    basicServices: DashboardService[];

    popularServices: DashboardService[];

    advertisements: DashboardAdvertisement[];

    unreadNotifications: number;
  };
};


// ==========================================
// API
// ==========================================

export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ======================================
    // CUSTOMER DASHBOARD
    // GET /api/customer/dashboard
    // ======================================

    getCustomerDashboard: build.query<
      CustomerDashboardResponse,
      void
    >({
      query: () => ({
        url:
          ENDPOINT_CONSTANTS.customerDashboard,
        method: 'GET',
      }),

      providesTags: [
        'Session',
        'Orders',
        'Wallet',
        'Coins',
      ],
    }),


    // ======================================
    // SUBMIT SERVICE REQUEST
    // POST /api/customer/service-request
    // ======================================

    submitServiceRequest: build.mutation<
      ServiceRequestResponse,
      SubmitServiceRequestPayload
    >({
      query: body => ({
        url:
          ENDPOINT_CONSTANTS.customerServiceRequest,

        method: 'POST',

        body,
      }),

      invalidatesTags: [
        'Session',
      ],
    }),


    // ======================================
    // GET MY SERVICE REQUEST
    // GET /api/customer/service-request
    // ======================================

    getMyServiceRequest: build.query<
      ServiceRequestResponse,
      void
    >({
      query: () => ({
        url:
          ENDPOINT_CONSTANTS.customerServiceRequest,

        method: 'GET',
      }),

      providesTags: [
        'Session',
      ],
    }),

  }),

  overrideExisting: false,
});


// ==========================================
// GENERATED HOOKS
// ==========================================

export const {
  useGetCustomerDashboardQuery,

  useSubmitServiceRequestMutation,

  useGetMyServiceRequestQuery,

} = customerApi;
