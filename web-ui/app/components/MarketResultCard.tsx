import {
  BarChart3,
  Copy,
  DollarSign,
  Download,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { MarketData } from "~/store/marketStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface MarketResultCardProps {
  data: MarketData;
  sector: string;
  showActions?: boolean;
}

export function MarketResultCard({
  data,
  sector,
  showActions = true,
}: MarketResultCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const generateMarkdown = () => {
    let markdown = `# Market Intelligence Report: ${sector}\n\n`;
    markdown += `## 📊 Sector Summary\n\n${data.summary}\n\n`;
    markdown += `## 🔎 Key Market Trends\n\n`;
    data.trends.forEach((trend) => {
      markdown += `- ${trend}\n`;
    });
    markdown += `\n## 🚀 Notable Startups / Companies\n\n`;
    data.startups.forEach((startup) => {
      markdown += `### ${startup.name}\n`;
      markdown += `${startup.description}\n`;
      markdown += `[Learn more](${startup.link})\n\n`;
    });
    markdown += `## 💰 Investment Themes / Theses\n\n`;
    data.theses.forEach((thesis) => {
      markdown += `- ${thesis}\n`;
    });
    return markdown;
  };

  const handleCopy = async () => {
    const markdown = generateMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market-intelligence-${sector
      .replace(/\s+/g, "-")
      .toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Sector Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            Sector Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {data.summary}
          </p>
        </CardContent>
      </Card>

      {/* Key Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            Key Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.trends.map((trend, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground"
              >
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{trend}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Notable Startups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Rocket className="h-5 w-5 sm:h-6 sm:w-6" />
            Notable Startups / Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.startups.map((startup, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <h4 className="font-semibold text-base sm:text-lg mb-2">
                  {startup.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3">
                  {startup.description}
                </p>
                {startup.link && (
                  <a
                    href={startup.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
            Investment Themes / Theses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.theses.map((thesis, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground"
              >
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{thesis}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopy}
            className="gap-2 font-semibold"
          >
            <Copy className="h-4 w-4" />
            {copySuccess ? "Copied!" : "Copy as Markdown"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownload}
            className="gap-2 font-semibold"
          >
            <Download className="h-4 w-4" />
            Download Markdown
          </Button>
        </div>
      )}
    </div>
  );
}
