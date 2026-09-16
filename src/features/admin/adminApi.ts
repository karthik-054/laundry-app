import { baseApi } from '../../services/baseApi';
import { ENDPOINT_CONSTANTS } from '../../constants/endpoint';

import type {
  AdminDashboard,
  DeliveryDashboard,
  NotificationItem,
  Order,
  User,
} from '../../types';

// ============================================
// SERVICE REQUEST TYPES
// ============================================

export interface ServiceRequest {
  _id: string;

  customerId: string;

  status:
  | 'pending'
  | 'approved'
  | 'rejected';

  createdAt?: string;

  updatedAt?: string;

  name?: string;

  email?: string;

  phone?: string;

  address?: string;

  landmark?: string;

  city?: string;

  pincode?: string;
}

export interface AssignedBy {
  id: string;
  name: string;
  email?: string;
}

export interface AdminCustomer {
  id: string;

  name: string;

  email?: string;

  phone?: string;

  address?: string;
}

export interface DeliveryPerson {
  id: string;

  name: string;

  email?: string;

  phone?: string;

  busy?: boolean;

  isActive?: boolean;
}

export interface ServiceRequestResponse {
  success: boolean;

  message: string;

  data: ServiceRequest;
}

export interface AdminServiceRequestsResponse {
  success: boolean;

  count: number;

  data: ServiceRequest[];
}

export interface ReportsData {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface ReportsResponse {
  success: boolean;
  data: ReportsData;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  createdAt?: string;

  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  } | null;

  order: {
    id: string;
    orderNumber: string;
    serviceName?: string;
  } | null;
}

interface AdminReviewsResponse {
  success: boolean;
  count: number;
  data: AdminReview[];
}
// ============================================
// ADMIN ORDER TYPE
// ============================================

export interface AdminOrder {
  id: string;

  orderNumber: string;

  customer: AdminCustomer | null;

  serviceName: string;


  items?: {
    dressType: string;
    dressName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];

  deliveryPreference?: string;

  subtotal?: number;

  finalAmount: number;

  pickupAddress?: string;
  deliveryAddress?: string;

  paymentMethod: string;

  paymentStatus: string;

  status: string;

  pickupAt: string;

  expectedDeliveryAt?: string;

  pickupDeliveryUser: DeliveryPerson | null;

  dropDeliveryUser: DeliveryPerson | null;

  assignedAt?: string;

  assignedBy?: AssignedBy | null;

  createdAt: string;

  updatedAt?: string;
}

// ============================================
// BACKEND DELIVERY PERSON
// ============================================

interface BackendDeliveryPerson {
  id: string;

  name: string;

  email?: string;

  phone?: string;

  busy?: boolean;

  isActive?: boolean;
}

// ============================================
// BACKEND CUSTOMER
// ============================================

interface BackendCustomer {
  id: string;

  name?: string;

  email?: string;

  phone?: string;

  address?: string;
}

// ============================================
// BACKEND ADMIN ORDER
// ============================================

interface BackendAdminOrder {
  id: string;

  orderNumber: string;

  customer?: BackendCustomer | null;

  serviceName?: string;

  items?: {
    dressType: string;

    dressName: string;

    quantity: number;

    unitPrice: number;

    lineTotal: number;
  }[];

  deliveryPreference?: string;

  subtotal?: number;

  finalAmount?: number;

  paymentMethod?: string;

  paymentStatus?: string;

  status?: string;

  pickupAt?: string;

  expectedDeliveryAt?: string;

  pickupDeliveryUser?:
  | BackendDeliveryPerson
  | null;

  dropDeliveryUser?:
  | BackendDeliveryPerson
  | null;

  assignedAt?: string;

  assignedBy?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================
// ADMIN API
// ============================================

export const adminApi =
  baseApi.injectEndpoints({
    endpoints: build => ({

      // ========================================
      // NOTIFICATIONS
      // ========================================

      notifications:
        build.query<
          NotificationItem[],
          void
        >({
          query: () =>
            '/notifications',

          providesTags: [
            'Notifications',
          ],
        }),

      // ========================================
      // ADMIN ORDERS
      // GET /api/admin/orders
      // ========================================

      getAdminOrders:
        build.query<
          AdminOrder[],
          void
        >({
          query: () => ({
            url: '/admin/orders',
            method: 'GET',
          }),

          transformResponse: (
            response: {
              success: boolean;
              count: number;
              data: AdminOrder[];
            }
          ) => response.data,

          providesTags: ['Orders'],
        }),

      // ========================================
      // GET DELIVERY PERSONS
      // GET /api/admin/delivery-persons
      // ========================================

      getDeliveryPersons:
        build.query<
          DeliveryPerson[],
          void
        >({
          query: () => ({
            url:
              '/admin/delivery-persons',

            method: 'GET',
          }),

          transformResponse: (
            response: {
              success?: boolean;

              data?:
              BackendDeliveryPerson[];
            },
          ): DeliveryPerson[] => {

            return (
              response.data?.map(
                person => ({
                  id: person.id,

                  name: person.name,

                  email: person.email,

                  phone: person.phone,

                  busy: person.busy,

                  isActive:
                    person.isActive,
                }),
              ) ?? []
            );
          },

          providesTags: [
            'Delivery',
          ],
        }),

      // ========================================
      // CREATE DELIVERY USER
      // POST /api/admin/delivery-users
      // ========================================

      createDeliveryUser:
        build.mutation<
          User,
          {
            name: string;

            email: string;

            phone: string;

            password: string;
          }
        >({
          query: body => ({
            url:
              '/admin/delivery-users',

            method: 'POST',

            body,
          }),

          transformResponse: (
            response: {
              success: boolean;

              data: User;
            },
          ) =>
            response.data,

          invalidatesTags: [
            'Admin',
            'Delivery',
          ],
        }),

      // ========================================
      // ASSIGN ORDER
      // PUT /api/admin/orders/:id/assign
      // ========================================

      assignOrder:
        build.mutation<
          AdminOrder,
          {
            orderId: string;

            deliveryPersonId:
            string;
          }
        >({
          query: ({
            orderId,
            deliveryPersonId,
          }) => ({
            url:
              `/admin/orders/${orderId}/assign`,

            method: 'PUT',

            body: {
              deliveryPersonId,
            },
          }),

          transformResponse: (
            response: {
              success?: boolean;

              data?: BackendAdminOrder;
            },
          ): AdminOrder => {

            const order =
              response.data;

            if (!order) {
              throw new Error(
                'Order assignment response is empty',
              );
            }

            return {
              id: order.id,

              orderNumber:
                order.orderNumber,

              customer:
                order.customer
                  ? {
                    id:
                      order.customer.id,

                    name:
                      order.customer.name ??
                      'Customer',

                    email:
                      order.customer.email,

                    phone:
                      order.customer.phone,

                    address:
                      order.customer.address,
                  }
                  : null,

              serviceName:
                order.serviceName ??
                'Service',

              items:
                order.items,

              finalAmount:
                order.finalAmount ?? 0,

              paymentMethod:
                order.paymentMethod ??
                'UNKNOWN',

              paymentStatus:
                order.paymentStatus ??
                'PENDING',

              status:
                order.status ??
                'UNKNOWN',

              pickupAt:
                order.pickupAt ?? '',

              expectedDeliveryAt:
                order.expectedDeliveryAt,

              pickupDeliveryUser:
                order.pickupDeliveryUser
                  ? {
                    id:
                      order
                        .pickupDeliveryUser
                        .id,

                    name:
                      order
                        .pickupDeliveryUser
                        .name,

                    email:
                      order
                        .pickupDeliveryUser
                        .email,

                    phone:
                      order
                        .pickupDeliveryUser
                        .phone,

                    busy:
                      order
                        .pickupDeliveryUser
                        .busy,

                    isActive:
                      order
                        .pickupDeliveryUser
                        .isActive,
                  }
                  : null,

              dropDeliveryUser:
                order.dropDeliveryUser
                  ? {
                    id:
                      order
                        .dropDeliveryUser
                        .id,

                    name:
                      order
                        .dropDeliveryUser
                        .name,

                    email:
                      order
                        .dropDeliveryUser
                        .email,

                    phone:
                      order
                        .dropDeliveryUser
                        .phone,

                    busy:
                      order
                        .dropDeliveryUser
                        .busy,

                    isActive:
                      order
                        .dropDeliveryUser
                        .isActive,
                  }
                  : null,

              assignedAt:
                order.assignedAt,

              assignedBy:
                order.assignedBy,

              createdAt:
                order.createdAt ?? '',
            };
          },

          invalidatesTags: [
            'Orders',
            'Delivery',
            'Admin',
          ],
        }),
      //admin-review 
      getAdminReviews:
        build.query<AdminReview[], void>({
          query: () => '/reviews/admin',

          transformResponse: (
            response: AdminReviewsResponse,
          ): AdminReview[] => {
            return response.data ?? [];
          },

          providesTags: ['Reviews'],
        }),

      // ========================================
      // READ NOTIFICATION
      // ========================================

      readNotification:
        build.mutation<
          { ok: boolean },
          string
        >({
          query: id => ({
            url:
              `/notifications/${id}/read`,

            method: 'POST',
          }),

          invalidatesTags: [
            'Notifications',
          ],
        }),

      // ========================================
      // UPDATE ORDER STATUS
      // PATCH /api/admin/orders/:id/status
      // ========================================

      updateAdminOrderStatus:
        build.mutation<
          AdminOrder,
          {
            orderId: string;
            status:
            | 'PROCESSING'
            | 'READY_FOR_DELIVERY';
          }
        >({
          query: ({
            orderId,
            status,
          }) => ({
            url: `/admin/orders/${orderId}/status`,
            method: 'PATCH',
            body: {
              status,
            },
          }),

          transformResponse: (
            response: {
              success: boolean;
              message: string;
              data: AdminOrder;
            }
          ) => response.data,

          invalidatesTags: [
            'Orders',
            'Admin',
            'Delivery',
          ],
        }),

      // ========================================
      // ADMIN DASHBOARD
      // ========================================

      adminDashboard:
        build.query<
          AdminDashboard,
          void
        >({
          query: () =>
            '/admin/dashboard',

          providesTags: [
            'Admin',
          ],
        }),

      // ========================================
      // REPORTS
      // ========================================

      reports:
        build.query<
          ReportsData,
          void
        >({
          query: () =>
            '/admin/reports',

          transformResponse: (
            response: ReportsResponse,
          ): ReportsData => response.data,

          providesTags: [
            'Admin',
          ],
        }),
      // ========================================
      // DELIVERY USERS
      //
      // Uses the existing backend GET endpoint
      // /admin/delivery-persons
      //
      // This keeps useDeliveryUsersQuery()
      // working in existing screens.
      // ========================================

      deliveryUsers:
        build.query<
          DeliveryPerson[],
          void
        >({
          query: () =>
            '/admin/delivery-persons',

          transformResponse: (
            response: {
              success: boolean;
              count: number;
              data: DeliveryPerson[];
            }
          ) => response.data,

          providesTags: [
            'Admin',
            'Delivery',
          ],
        }),

      // ========================================
      // DELIVERY DASHBOARD
      // ========================================

      deliveryDashboard:
        build.query<
          DeliveryDashboard,
          void
        >({
          query: () =>
            '/delivery/dashboard',

          providesTags: [
            'Delivery',
          ],
        }),

      // ========================================
      // DELIVERY PICKUPS
      // ========================================

      pickups:
        build.query<
          Order[],
          void
        >({
          query: () =>
            '/delivery/pickups',

          providesTags: [
            'Delivery',
          ],
        }),

      // ========================================
      // DELIVERY ORDERS
      // ========================================

      deliveries:
        build.query<
          Order[],
          void
        >({
          query: () =>
            '/delivery/deliveries',

          providesTags: [
            'Delivery',
          ],
        }),

      // ========================================
      // UPDATE DELIVERY STATUS
      // ========================================

      deliveryStatus:
        build.mutation<
          Order,
          {
            id: string;

            status: string;
          }
        >({
          query: ({
            id,
            status,
          }) => ({
            url:
              `/delivery/orders/${id}/status`,

            method: 'POST',

            body: {
              status,
            },
          }),

          invalidatesTags: [
            'Delivery',
            'Orders',
          ],
        }),

      // ========================================
      // COLLECT COD
      // ========================================

      collectCod:
        build.mutation<
          Order,
          string
        >({
          query: id => ({
            url:
              `/delivery/orders/${id}/cod-collect`,

            method: 'POST',
          }),

          invalidatesTags: [
            'Delivery',
            'Orders',
            'Payments',
          ],
        }),

      // ========================================
      // GET SERVICE REQUESTS
      // ========================================

      getServiceRequests:
        build.query<
          AdminServiceRequestsResponse,
          void
        >({
          query: () => ({
            url:
              ENDPOINT_CONSTANTS
                .adminServiceRequests,

            method: 'GET',
          }),

          providesTags: [
            'Admin',
          ],
        }),

      // ========================================
      // APPROVE SERVICE REQUEST
      // ========================================

      approveServiceRequest:
        build.mutation<
          ServiceRequestResponse,
          string
        >({
          query: id => ({
            url:
              ENDPOINT_CONSTANTS
                .approveServiceRequest(
                  id,
                ),

            method: 'PUT',
          }),

          invalidatesTags: [
            'Admin',
            'Session',
          ],
        }),

      // ========================================
      // REJECT SERVICE REQUEST
      // ========================================

      rejectServiceRequest:
        build.mutation<
          ServiceRequestResponse,
          string
        >({
          query: id => ({
            url:
              ENDPOINT_CONSTANTS
                .rejectServiceRequest(
                  id,
                ),

            method: 'PUT',
          }),

          invalidatesTags: [
            'Admin',
            'Session',
          ],
        }),
    }),

    overrideExisting: false,
  });

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Notifications
  useNotificationsQuery,
  useReadNotificationMutation,

  // Admin Orders
  useGetAdminOrdersQuery,

  // Delivery Persons
  useGetDeliveryPersonsQuery,

  // Assign Order
  useAssignOrderMutation,

  // Admin
  useAdminDashboardQuery,
  useReportsQuery,

  // Delivery Users
  useDeliveryUsersQuery,
  useCreateDeliveryUserMutation,

  // Delivery
  useDeliveryDashboardQuery,
  usePickupsQuery,
  useDeliveriesQuery,
  useDeliveryStatusMutation,
  useCollectCodMutation,
  useUpdateAdminOrderStatusMutation,
  useGetAdminReviewsQuery,

  // Service Requests
  useGetServiceRequestsQuery,
  useApproveServiceRequestMutation,
  useRejectServiceRequestMutation,
} = adminApi;