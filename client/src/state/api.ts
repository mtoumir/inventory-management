import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Material {
  codeSAP: String;
  designation?: String;
  unit?: String;
  typeArticle?: String;
  PU?: number;
  quantity?: number;
  cout?: number;
  imputation?: String;
  desImputation?: String;
}

export interface SortiesSummary {
  sortieSummaryId: string;
  sortieTotalQuantity: number;
  date: string;
}

export interface ProductionsSummary {
  productionSummaryId: string;
  productionTotalQuantity: number;
  date: string;
}



export interface DashboardMetrics {
  popularMaterials: Material[];
  sortiesSummary: SortiesSummary[];
  productionsSummary: ProductionsSummary[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  }),
  reducerPath: 'api',
  tagTypes: ["DashboardMetrics"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => '/dashboard',
      providesTags: ['DashboardMetrics'],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
} = api;