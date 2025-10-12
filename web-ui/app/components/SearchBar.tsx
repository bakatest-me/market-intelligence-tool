import { Search } from "lucide-react";
import { useState } from "react";
import { useMarketStore } from "~/store/marketStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const { fetchMarketData, isLoading } = useMarketStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchMarketData(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter sector keyword (e.g., AI for Energy Efficiency)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 h-12 text-base"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !inputValue.trim()}
          className="h-12 px-8 font-semibold"
        >
          {isLoading ? "Analyzing..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
