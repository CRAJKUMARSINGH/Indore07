import { useListEntries, useGetEvaluationSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import { AlertCircle, FileText, CheckCircle2, XCircle, ChevronRight, BarChart3, Users } from "lucide-react";

export default function Dashboard() {
  const { data: entries, isLoading: isLoadingEntries } = useListEntries();
  const { data: summary, isLoading: isLoadingSummary } = useGetEvaluationSummary();

  const isLoading = isLoadingEntries || isLoadingSummary;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full bg-muted" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full bg-muted" />
      </div>
    );
  }

  if (!entries || !summary) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-muted-foreground/30 rounded-lg">
        <p className="text-muted-foreground font-mono text-sm">Failed to load evaluation data.</p>
      </div>
    );
  }

  // Podiums are ranks 1, 2, 3
  const podiumEntries = [...entries].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const otherEntries = [...entries].sort((a, b) => a.rank - b.rank).slice(3);

  const formatHiringTier = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "STRONG_HIRE": return "Strong Hire";
      case "HIRE": return "Hire";
      case "LEAN_HIRE": return "Lean Hire";
      case "NO_HIRE": return "No Hire";
      default: return tier;
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    const t = tier.toUpperCase();
    if (t === "STRONG_HIRE") return "default";
    if (t === "HIRE") return "secondary";
    if (t === "LEAN_HIRE") return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Competition Results</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          CONFIDENTIAL — Internal Review Committee Only
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" /> Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary.totalEntries}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Avg Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{summary.averageScore.toFixed(1)}<span className="text-muted-foreground text-xl">/10</span></div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-2">
              <Users className="w-4 h-4" /> Judges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium leading-tight">
              {summary.judges.join(", ")}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Top Scorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">{summary.topScorer}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest font-mono text-muted-foreground border-b border-border pb-2">Final Ranking</h2>
          
          <Card className="overflow-hidden border-border bg-card">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px] font-mono">Rank</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Beauty</TableHead>
                  <TableHead className="text-right">Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.sort((a,b) => a.rank - b.rank).map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/30 group">
                    <TableCell className="font-mono text-muted-foreground font-bold">#{entry.rank}</TableCell>
                    <TableCell>
                      <Link href={`/entry/${entry.id}`} className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                        {entry.name}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{entry.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">{entry.overallScore.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{entry.beautyScore.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getTierBadgeVariant(entry.hiringTier)}>
                        {formatHiringTier(entry.hiringTier)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Universal Shortcomings & Notes */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest font-mono text-muted-foreground border-b border-border pb-2">Committee Notes</h2>
          
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" /> Universal Shortcomings
              </CardTitle>
              <CardDescription className="text-xs font-mono">Issues observed across all submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {summary.universalShortcomings.map((issue, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <XCircle className="w-4 h-4 text-destructive/70 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
