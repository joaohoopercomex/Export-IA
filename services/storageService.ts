import { SavedSimulation, ExportFormData, AnalysisResponse } from "../types";

const STORAGE_KEY = 'export_smart_history';

export const saveSimulation = (formData: ExportFormData, result: AnalysisResponse): SavedSimulation => {
  const newSimulation: SavedSimulation = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    formData,
    result
  };

  const currentHistory = loadHistory();
  const updatedHistory = [newSimulation, ...currentHistory];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  
  return newSimulation;
};

export const loadHistory = (): SavedSimulation[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing history", e);
    return [];
  }
};

export const deleteSimulation = (id: string): SavedSimulation[] => {
  const currentHistory = loadHistory();
  const updatedHistory = currentHistory.filter(sim => sim.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};