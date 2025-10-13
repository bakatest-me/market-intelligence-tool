import { History, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { EmailSubscriber } from "~/components/EmailSubscriber";
import { ResultsDisplay } from "~/components/ResultsDisplay";
import { SearchBar } from "~/components/SearchBar";
import { Button } from "~/components/ui/button";
import { useMarketStore } from "~/store/marketStore";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Market Intelligence Tool" },
    {
      name: "description",
      content: "Corporate Venture Capital Market Analysis",
    },
  ];
}

export default function Home() {
  const { isLoading, data, error, history } = useMarketStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex justify-end mb-4">
            <Link to="/history">
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                History {history.length > 0 && `(${history.length})`}
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI Market Intelligence Tool
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover market trends, notable startups, and investment
            opportunities with AI-powered analysis
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
          <SearchBar />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-primary mb-4" />
            <p className="text-base sm:text-lg text-muted-foreground">
              Analyzing market intelligence...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <p className="text-destructive font-semibold mb-2">Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {data && !isLoading && <ResultsDisplay />}

        {/* Empty State */}
        {!data && !isLoading && !error && (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl">🔍</span>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground">
              Enter a sector keyword to get started
            </p>
          </div>
        )}

        {/* Email Subscriber */}
        <div className="mt-16 sm:mt-24">
          <EmailSubscriber />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 sm:mt-24">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            AI Market Intelligence Tool © 2025 • Powered by Advanced LLM
            Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
