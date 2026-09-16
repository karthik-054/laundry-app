import { baseApi } from '../../services/baseApi';

export type SupportTicket = {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

type TicketListResponse = {
  success: boolean;
  count: number;
  data: SupportTicket[];
};

type CreateTicketResponse = {
  success: boolean;
  message: string;
  data: SupportTicket;
};

export const supportApi = baseApi.injectEndpoints({
  endpoints: build => ({
    tickets: build.query<
      SupportTicket[],
      void
    >({
      query: () => '/support/tickets',

      transformResponse: (
        response: TicketListResponse
      ) => response.data || [],

      providesTags: ['Support'],
    }),

    createTicket: build.mutation<
      SupportTicket,
      {
        category: string;
        subject: string;
        message: string;
      }
    >({
      query: body => ({
        url: '/support/tickets',
        method: 'POST',
        body,
      }),

      transformResponse: (
        response: CreateTicketResponse
      ) => response.data,

      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useTicketsQuery,
  useCreateTicketMutation,
} = supportApi;