import { useGetEntry } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, User, Star, AlertTriangle, ShieldAlert, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function EntryDetail() {
  const params = useParams<{ id: string }>();
  const { data: entry, isLoading } = useGetEntry(params.id || "");

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground font-mono">Entry not found.</p>
        <Link href="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

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

  const getSeverityColor = (severity: string) => {
    const s = severity.toUpperCase();
    if (s === "HIGH") return "text-destructive border-destructive/50 bg-destructive/10";
    if (s === "MEDIUM") return "text-orange-500 border-orange-500/50 bg-orange-500/10";
    return "text-muted-foreground border-border bg-muted/50";
  };

  const getSeverityIcon = (severity: string) => {
    const s = severity.toUpperCase();
    if (s === "HIGH") return <ShieldAlert className="w-4 h-4" />;
    if (s === "MEDIUM") return <AlertTriangle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-mono mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-2xl font-bold text-primary">#{entry.rank}</span>
              <h1 className="text-4xl font-bold tracking-tight">{entry.name}</h1>
              <Badge variant="outline" className="font-mono">{entry.type}</Badge>
            </div>
            <p className="text-muted-foreground max-w-3xl leading-relaxed mt-4">
              {entry.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <div className="text-sm font-mono text-muted-foreground uppercase">Committee Verdict</div>
            <Badge variant={getTierBadgeVariant(entry.hiringTier)} className="text-sm px-3 py-1">
              {formatHiringTier(entry.hiringTier)}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-tight">
              {entry.hiringVerdict}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scores Overview */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" /> Overall Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-medium">Technical & Execution</span>
                <span className="font-mono text-2xl font-bold">{entry.overallScore.toFixed(1)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${(entry.overallScore / 10) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-medium">Aesthetic & Beauty</span>
                <span className="font-mono text-2xl font-bold text-muted-foreground">{entry.beautyScore.toFixed(1)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-muted-foreground/50 h-2 rounded-full" style={{ width: `${(entry.beautyScore / 10) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Judge Breakdown */}
        <Card className="md:col-span-2 bg-card">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> Judge Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Judge</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Verdict Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.judgeScores.map((js, i) => (
                  <TableRow key={i} className="border-border hover:bg-muted/20">
                    <TableCell className="font-medium whitespace-nowrap">{js.judge}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{js.score.toFixed(1)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{js.verdict}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest font-mono text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {entry.strengths.map((strength, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Shortcomings */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Identified Shortcomings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entry.shortcomings.map((sc, i) => (
                <div key={i} className={`p-4 rounded-md border ${getSeverityColor(sc.severity)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(sc.severity)}
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">{sc.severity} • {sc.category}</span>
                  </div>
                  <p className="text-sm opacity-90">{sc.issue}</p>
                </div>
              ))}
              {entry.shortcomings.length === 0 && (
                <p className="text-muted-foreground text-sm italic">No major shortcomings noted.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
