import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  History as HistoryIcon,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MarketResultCard } from "~/components/MarketResultCard";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { MarketData } from "~/store/marketStore";
import type { Route } from "./+types/history";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Search History - AI Market Intelligence Tool" },
    {
      name: "description",
      content: "View your market analysis search history",
    },
  ];
}

const ITEMS_PER_PAGE = 10;

interface HistoryListItem {
  id: number;
  sector: string;
}

interface HistoryApiResponse {
  code: number;
  message: string;
  data: HistoryListItem[];
}

interface HistoryDetailResponse {
  data: MarketData;
  sector: string;
}

export default function History() {
  const [historyList, setHistoryList] = useState<HistoryListItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<{
    sector: string;
    data: MarketData;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch history list from API
  useEffect(() => {
    const fetchHistoryList = async () => {
      setIsLoadingList(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/history?page=${currentPage}&perPage=${ITEMS_PER_PAGE}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const result: HistoryApiResponse = await response.json();

        if (result.code === 200) {
          setHistoryList(result.data);

          // Calculate total pages (assuming we get less than ITEMS_PER_PAGE on last page)
          // Note: API should ideally return total count, but we'll estimate based on response
          if (result.data.length < ITEMS_PER_PAGE && currentPage > 1) {
            setTotalPages(currentPage);
          } else if (result.data.length === ITEMS_PER_PAGE) {
            // There might be more pages, keep current totalPages or increment
            setTotalPages(Math.max(totalPages, currentPage + 1));
          }

          // Auto-select first item if nothing is selected
          if (result.data.length > 0 && !selectedHistoryId) {
            setSelectedHistoryId(result.data[0].id);
          }
        } else {
          throw new Error(result.message || "Failed to fetch history");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchHistoryList();
  }, [currentPage]);

  // Fetch history detail when an item is selected
  useEffect(() => {
    if (!selectedHistoryId) {
      setSelectedItem(null);
      return;
    }

    const fetchHistoryDetail = async () => {
      setIsLoadingDetail(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/41c11638-417b-4001-b5ab-7da151f94e16/api/history/${selectedHistoryId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch history detail");
        }
        const result: HistoryDetailResponse = await response.json();
        const selectedFromList = historyList.find(
          (item) => item.id === selectedHistoryId
        );

        setSelectedItem({
          sector: result?.sector || "",
          data: result.data,
        });
      } catch (err) {
        console.error("Error fetching history detail:", err);
        setSelectedItem(null);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchHistoryDetail();
  }, [selectedHistoryId, historyList]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedHistoryId(null);
    setSelectedItem(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/41c11638-417b-4001-b5ab-7da151f94e16/api/history/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete history item");
      }

      // Refresh the list
      setHistoryList((prev) => prev.filter((item) => item.id !== id));

      if (selectedHistoryId === id) {
        const remaining = historyList.filter((item) => item.id !== id);
        setSelectedHistoryId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error("Error deleting history item:", err);
      alert("Failed to delete history item");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all history?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/history`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to clear history");
      }

      setHistoryList([]);
      setSelectedHistoryId(null);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error clearing history:", err);
      alert("Failed to clear history");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                <HistoryIcon className="h-8 w-8" />
                Search History
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                View and manage your market analysis searches
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              {/* {historyList.length > 0 && (
                <Button variant="destructive" onClick={handleClearAll}>
                  Clear All
                </Button>
              )} */}
            </div>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center mb-8">
            <p className="text-destructive font-semibold mb-2">Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoadingList ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-base text-muted-foreground">
              Loading history...
            </p>
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
              <HistoryIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No search history yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start searching for market intelligence to build your history
            </p>
            <Link to="/">
              <Button>Go to Search</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - History List */}
            <div className="lg:col-span-4 xl:col-span-3">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Searches</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2 space-y-2">
                    {historyList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHistoryId(item.id)}
                        className={`relative group rounded-lg border transition-all cursor-pointer ${
                          selectedHistoryId === item.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  selectedHistoryId === item.id
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                                }`}
                              />
                              <h3 className="font-semibold text-sm truncate">
                                {item.sector}
                              </h3>
                            </div>
                            <p className="text-xs text-muted-foreground pl-4">
                              Analysis #{item.id}
                            </p>
                          </div>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button> */}
                        </div>
                        {selectedHistoryId === item.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Result Display */}
            <div className="lg:col-span-8 xl:col-span-9">
              {isLoadingDetail ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-base text-muted-foreground">
                    Loading details...
                  </p>
                </div>
              ) : selectedItem ? (
                <div className="animate-in fade-in duration-300">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {selectedItem.sector}
                        </span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <MarketResultCard
                    data={selectedItem.data}
                    sector={selectedItem.sector}
                    showActions={true}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-muted-foreground">
                    Select a search from the history to view results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
