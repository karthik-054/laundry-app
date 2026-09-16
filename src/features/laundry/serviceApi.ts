import { baseApi } from '../../services/baseApi';

import type {
  DressType,
  Faq,
  MembershipPlan,
  Service,
  ServicePrice,
  AppSettings,
} from '../../types';

type ApiListResponse<T> = {
  success: boolean;
  count: number;
  data: T[];
};

export const serviceApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // ============================================
    // SERVICES
    // ============================================

    services: build.query<Service[], void>({
      query: () => '/catalog/services',

      transformResponse: (
        response: ApiListResponse<Service>,
      ) => response.data,

      providesTags: ['Catalog'],
    }),

    // ============================================
    // DRESS TYPES
    // ============================================

    dressTypes: build.query<DressType[], void>({
      query: () => '/catalog/dress-types',

      transformResponse: (
        response: ApiListResponse<DressType>,
      ) => response.data,

      providesTags: ['Catalog'],
    }),

    // ============================================
    // SERVICE PRICES
    // ============================================

    prices: build.query<ServicePrice[], void>({
      query: () => '/catalog/prices',

      transformResponse: (
        response: ApiListResponse<ServicePrice>,
      ) => response.data,

      providesTags: ['Catalog'],
    }),

    // ============================================
    // CATALOG SETTINGS
    // ============================================

    catalogSettings: build.query<
      {
        settings: AppSettings;
        membershipPlans: MembershipPlan[];
        faqs: Faq[];
      },
      void
    >({
      query: () => '/catalog/settings',

      providesTags: ['Catalog'],
    }),
  }),
});

export const {
  useServicesQuery,
  useDressTypesQuery,
  usePricesQuery,
  useCatalogSettingsQuery,
} = serviceApi;