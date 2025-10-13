import { useMarketStore } from "~/store/marketStore";
import { MarketResultCard } from "./MarketResultCard";

export function ResultsDisplay() {
  const { data, sector, reset } = useMarketStore();

  if (!data) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <MarketResultCard data={data} sector={sector} showActions={true} />
    </div>
  );
}
