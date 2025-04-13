import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Material {
  codeSAP: string;
  designation?: string;
  unit?: string;
  typeArticle?: string;
  PU?: number;
  quantity?: number;
  cout?: number;
  imputation?: string;
  desImputation?: string;
}

export interface NewMaterial {
  codeSAP: string;
  designation?: string;
  unit?: string;
  typeArticle?: string;
  PU?: number;
  quantity?: number;
  cout?: number;
  imputation?: string;
  desImputation?: string;
}

export interface SortiesSummary {
  sortieSummaryId: string;
  sortieTotalQuantity?: number;
  sortieChangePercentage?: number;
  date?: string;
}

export interface ProductionSummary {
  productionSummaryId: string;
  productionTotalQuantity?: number;
  productionChangePercentage?: number;
  date?: string;
}



export interface DashboardMetrics {
  popularMaterials: Material[];
  sortiesSummary: SortiesSummary[];
  productionSummary: ProductionSummary[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  }),
  reducerPath: 'api',
  tagTypes: ["DashboardMetrics", "Materials"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => '/dashboard',
      providesTags: ['DashboardMetrics'],
    }),

    getMaterials: build.query<Material[], string | void>({
      query: (search) => ({
        url: '/materials',
        params: search ? { search } : {},
      }),
      providesTags: ['Materials'],
    }),

    createMaterial: build.mutation<Material, NewMaterial>({
      query: (newMaterial) => ({
        url: '/materials',
        method: 'POST',
        body: newMaterial,
      }),
      invalidatesTags: ['Materials'],
    }),

    updateMaterial: build.mutation<Material, Partial<Material>>({
      query: ({ codeSAP, ...patch }) => ({
        url: `/materials/${codeSAP}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Materials'],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetMaterialsQuery,
  useCreateMaterialMutation,
} = api;