import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ========================
// Interfaces
// ========================

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

export interface NewMaterial extends Omit<Material, 'codeSAP'> {
  codeSAP: string;
}

export interface Sortie {
  sortieId: string;
  codeSAP: string;
  quantity: number;
  timeStamp: string;
  userName: string;
  material: Material;
  productions?: Production[];
}

export interface NewSortie {
  codeSAP: string;
  quantity: number;
  userName: string;
  timeStamp?: string; // Optional from client
}

export interface Production {
  productionId: string;
  sortieId: string;
  quantity?: number;
  wasteQuantity?: number;
  timeStamp: string;
  sortie: Sortie;
}

export interface NewProduction {
  sortieId: string;
  quantity: number;
  wasteQuantity?: number;
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

// ========================
// API Slice
// ========================
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ['DashboardMetrics', 'Materials', 'Sorties', 'Productions'],
  endpoints: (build) => ({
    // ========================
    // Dashboard
    // ========================
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => '/dashboard',
      providesTags: ['DashboardMetrics'],
    }),

    // ========================
    // Materials
    // ========================
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
      invalidatesTags: ['Materials', 'DashboardMetrics'],
    }),

    updateMaterial: build.mutation<Material, Partial<Material> & { codeSAP: string }>({
      query: ({ codeSAP, ...patch }) => ({
        url: `/materials/${codeSAP}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Materials', 'DashboardMetrics'],
    }),

    deleteMaterial: build.mutation<void, string>({
      query: (codeSAP) => ({
        url: `/materials/${codeSAP}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Materials', 'DashboardMetrics'],
    }),

    // ========================
    // Sorties
    // ========================
    getSorties: build.query<Sortie[], void>({
      query: () => '/sorties',
      providesTags: ['Sorties'],
    }),

    createSortie: build.mutation<Sortie, NewSortie>({
      query: (newSortie) => ({
        url: '/sorties',
        method: 'POST',
        body: {
          ...newSortie,
          timeStamp: newSortie.timeStamp || new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Sorties', 'Materials', 'DashboardMetrics'],
    }),

    // ========================
    // Productions
    // ========================
    getProductions: build.query<Production[], void>({
      query: () => '/productions',
      providesTags: ['Productions'],
    }),

    createProduction: build.mutation<Production, NewProduction>({
      query: (newProduction) => ({
        url: '/productions',
        method: 'POST',
        body: newProduction,
      }),
      invalidatesTags: ['Productions', 'DashboardMetrics', 'Materials'],
    }),

    // Add the updateProduction mutation here
    updateProduction: build.mutation<Production, Partial<Production> & { productionId: string }>({
      query: ({ productionId, ...patch }) => ({
        url: `/productions/${productionId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Productions', 'DashboardMetrics', 'Materials'],
    }),
  }),
});

// ========================
// Exported Hooks
// ========================

export const {
  useGetDashboardMetricsQuery,
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  useGetSortiesQuery,
  useCreateSortieMutation,
  useGetProductionsQuery,
  useCreateProductionMutation,
  useUpdateProductionMutation,  // Export the hook for updateProduction
} = api;
