export type TransportMode = 'Maritime' | 'Air' | 'Road';

export interface ExportFormData {
  destination: string;
  productDescription: string;
  hsCode: string;
  transportMode: TransportMode;
  incoterm: string;
  fobValue: number;
  freightCost: number;
  insuranceCost: number;
  currency: string;
}

export interface CostItem {
  item: string;
  value: string; // Formatted string with currency or percentage
  rawValue: number; // Numeric value for charting
  note?: string;
}

// FIX: Define and export HistoricalDataItem to resolve import error in App.tsx.
export interface HistoricalDataItem {
  month: string;
  averageFobValue: number;
}

export interface AnalysisResponse {
  executiveSummary: string;
  fiscalAnalysis: string;
  costTable: CostItem[];
  finalLandedCost: string;
  strategies: string;
  // FIX: Add historicalData property to match API response schema and fix usage in App.tsx.
  historicalData: HistoricalDataItem[];
}

export interface ProductIdentificationResponse {
  hsCode: string;
  description: string;
  category: string;
  suggestedTransportMode: TransportMode;
}

export interface SavedSimulation {
  id: string;
  timestamp: number;
  formData: ExportFormData;
  result: AnalysisResponse;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}