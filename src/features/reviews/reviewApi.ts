import { baseApi } from '../../services/baseApi';


// ========================================
// TYPES
// ========================================

export type Review = {
  id: string;
  orderId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
};


type ReviewResponse = {
  success: boolean;
  data: Review | null;
};


type CreateReviewResponse = {
  success: boolean;
  message: string;
  data: Review;
};


// ========================================
// REVIEW API
// ========================================

export const reviewApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // ========================================
    // GET MY ORDER REVIEW
    // ========================================

    getMyOrderReview: build.query<
      Review | null,
      string
    >({
      query: orderId =>
        `/reviews/order/${orderId}`,

      transformResponse: (
        response: ReviewResponse,
      ) => response.data,

      providesTags: ['Reviews'],
    }),


    // ========================================
    // CREATE REVIEW
    // ========================================

    createReview: build.mutation<
      Review,
      {
        orderId: string;
        rating: number;
        comment: string;
      }
    >({
      query: body => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),

      transformResponse: (
        response: CreateReviewResponse,
      ) => response.data,

      invalidatesTags: ['Reviews'],
    }),
  }),
});


// ========================================
// EXPORT HOOKS
// ========================================

export const {
  useGetMyOrderReviewQuery,
  useCreateReviewMutation,
} = reviewApi;