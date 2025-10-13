import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Startup {
  name: string;
  description: string;
  link: string;
}

export interface MarketData {
  summary: string;
  trends: string[];
  startups: Startup[];
  theses: string[];
}

export interface HistoryItem {
  id: string;
  sector: string;
  data: MarketData;
  timestamp: number;
}

interface MarketState {
  sector: string;
  data: MarketData | null;
  isLoading: boolean;
  error: string | null;
  history: HistoryItem[];
  setSector: (sector: string) => void;
  fetchMarketData: (sector: string) => Promise<void>;
  reset: () => void;
  addToHistory: (sector: string, data: MarketData) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      sector: "",
      data: null,
      isLoading: false,
      error: null,
      history: [],

      setSector: (sector) => set({ sector }),

      fetchMarketData: async (sector: string) => {
        set({ isLoading: true, error: null, sector });

        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sector }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch market data");
          }

          const data = await response.json();
          set({ data, isLoading: false });
          
          // Add to history
          get().addToHistory(sector, data);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      addToHistory: (sector: string, data: MarketData) => {
        const historyItem: HistoryItem = {
          id: `${Date.now()}-${sector}`,
          sector,
          data,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          history: [historyItem, ...state.history].slice(0, 50), // Keep last 50 items
        }));
      },

      clearHistory: () => set({ history: [] }),

      removeHistoryItem: (id: string) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      reset: () => set({ sector: "", data: null, error: null, isLoading: false }),
    }),
    {
      name: "market-intelligence-storage",
      partialize: (state) => ({ history: state.history }),
    }
  )
);

