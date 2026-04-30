import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Stocks'],
  endpoints: (builder) => ({
    getStocks: builder.query({
      query: (params) => ({ url: '/stocks/search', params }),
      providesTags: ['Stocks'],
    }),
    getStockDetail: builder.query({
      query: (symbol) => `/stocks/${symbol}`,
      providesTags: (result, error, symbol) => [{ type: 'Stocks', id: symbol }],
    }),
  }),
});

export const { useGetStocksQuery, useGetStockDetailQuery } = stockApi;