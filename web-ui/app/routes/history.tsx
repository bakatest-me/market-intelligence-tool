import {
  ChevronLeft,
  ChevronRight,
  Clock,
  History as HistoryIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { MarketResultCard } from "~/components/MarketResultCard";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMarketStore } from "~/store/marketStore";
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

export default function History() {
  const { history, removeHistoryItem, clearHistory } = useMarketStore();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    history.length > 0 ? history[0].id : null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const selectedItem = history.find((item) => item.id === selectedHistoryId);

  // Pagination calculations
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHistory = history.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // If the selected item is not on the new page, select the first item of the new page
    const newPageItems = history.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
    if (
      selectedHistoryId &&
      !newPageItems.find((item) => item.id === selectedHistoryId)
    ) {
      setSelectedHistoryId(newPageItems.length > 0 ? newPageItems[0].id : null);
    }
  };

  const handleDelete = (id: string) => {
    removeHistoryItem(id);
    if (selectedHistoryId === id) {
      const remainingHistory = history.filter((item) => item.id !== id);
      setSelectedHistoryId(
        remainingHistory.length > 0 ? remainingHistory[0].id : null
      );
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
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
              {history.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to clear all history?")
                    ) {
                      clearHistory();
                      setSelectedHistoryId(null);
                    }
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </header>

        {history.length === 0 ? (
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
                  <CardTitle className="text-lg">
                    Recent Searches ({history.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                    {paginatedHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedHistoryId(item.id)}
                        className={`w-full text-left px-4 py-3 border-b border-border hover:bg-secondary/50 transition-colors ${
                          selectedHistoryId === item.id ? "bg-secondary" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate mb-1">
                              {item.sector}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(item.timestamp)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </button>
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
              {selectedItem ? (
                <div className="animate-in fade-in duration-300">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold">
                      {selectedItem.sector}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Analyzed on {formatDate(selectedItem.timestamp)}
                    </p>
                  </div>
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
