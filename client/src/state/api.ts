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

export interface WastedEntry {
  category: 'PRODUCTION' | 'MAINTENANCE' | 'OTHER';
  problem: 'MACHINE' | 'MATERIAL' | 'OTHER';
  Quantity: number;
}

export interface Shift {
  id: string;
  shiftType: 'MORNING' | 'MIDDAY' | 'NIGHT';
  date: string;
  technicien?: string;
  totalWasted: number;
  createdAt: string;
  wastedEntries: WastedEntry[];
}

export interface NewShift {
  shiftType: 'MORNING' | 'MIDDAY' | 'NIGHT';
  date: string;
  technicien?: string;
  totalWasted?: number; 
  wastedEntries: WastedEntry[];
}

// ========================
// API Slice
// ========================
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ['DashboardMetrics', 'Materials', 'Sorties', 'Productions', 'Shifts'],
  endpoints: (build) => ({
    // ========================
    // Dashboard
    // ========================

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

    updateProduction: build.mutation<Production, Partial<Production> & { productionId: string }>({
      query: ({ productionId, ...patch }) => ({
        url: `/productions/${productionId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Productions', 'DashboardMetrics', 'Materials'],
    }),

    // ========================
    // Shifts
    // ========================
    getShifts: build.query<Shift[], void>({
      query: () => '/shifts',
      providesTags: ['Shifts'],
    }),
    
    createShift: build.mutation<Shift, NewShift>({
      query: (newShift) => ({
        url: '/shifts',
        method: 'POST',
        body: newShift, // No need to add totalWasted or createdAt manually
      }),
      invalidatesTags: ['Shifts', 'DashboardMetrics'],
    }),

    deleteShift: build.mutation<void, string>({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shifts', 'DashboardMetrics'],
    }),
    
  }),
});

// ========================
// Exported Hooks
// ========================
export const {
  useCreateShiftMutation,
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  useGetSortiesQuery,
  useCreateSortieMutation,
  useGetProductionsQuery,
  useCreateProductionMutation,
  useUpdateProductionMutation,
  useGetShiftsQuery,
  useDeleteShiftMutation,
} = api;
