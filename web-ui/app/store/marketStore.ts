import { create } from "zustand";

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

interface MarketState {
  sector: string;
  data: MarketData | null;
  isLoading: boolean;
  error: string | null;
  setSector: (sector: string) => void;
  fetchMarketData: (sector: string) => Promise<void>;
  reset: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  sector: "",
  data: null,
  isLoading: false,
  error: null,

  setSector: (sector) => set({ sector }),

  fetchMarketData: async (sector: string) => {
    set({ isLoading: true, error: null, sector });

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
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
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  reset: () => set({ sector: "", data: null, error: null, isLoading: false }),
}));

