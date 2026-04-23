"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, AlertCircle, AlertTriangle, Info, CheckCircle2, RotateCcw, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MathResultStatus } from "@/lib/math/validation";
import Link from "next/link";

interface ResultCardProps {
  title?: string;
  result?: string | React.ReactNode;
  status?: MathResultStatus;
  statusMessage?: string;
  steps?: React.ReactNode;
  interpretation?: React.ReactNode;
  hints?: string[];
  onReset?: () => void;
  copyValue?: string;
  graphLink?: string;
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; label: string }> = {
  success:           { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-400",  bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Erfolg" },
  invalid:           { icon: <AlertCircle className="h-4 w-4" />,  color: "text-red-400",      bg: "bg-red-500/10",     border: "border-red-500/20",     label: "Ungültige Eingabe" },
  undefined:         { icon: <AlertTriangle className="h-4 w-4" />,color: "text-amber-400",    bg: "bg-amber-500/10",   border: "border-amber-500/20",   label: "Nicht definiert" },
  infinity:          { icon: <AlertTriangle className="h-4 w-4" />,color: "text-amber-400",    bg: "bg-amber-500/10",   border: "border-amber-500/20",   label: "Unendlich" },
  negative_infinity: { icon: <AlertTriangle className="h-4 w-4" />,color: "text-amber-400",    bg: "bg-amber-500/10",   border: "border-amber-500/20",   label: "Negativ unendlich" },
  non_real:          { icon: <Info className="h-4 w-4" />,         color: "text-blue-400",     bg: "bg-blue-500/10",    border: "border-blue-500/20",    label: "Kein reelles Ergebnis" },
};

export function ResultCard({
  title = "Ergebnis",
  result,
  status = "success",
  statusMessage,
  steps,
  interpretation,
  hints,
  onReset,
  copyValue,
  graphLink,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  if (!result && status === "success" && !steps && !statusMessage) return null;

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.success;
  const isError = status !== "success";

  const handleCopy = () => {
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`relative overflow-hidden border ${isError ? cfg.border : 'border-border/60'} shadow-lg`}>
      {/* Accent stripe */}
      <div className={`absolute top-0 left-0 w-full h-1 ${isError ? cfg.bg : 'bg-gradient-to-r from-primary/60 via-primary to-primary/60'}`} />

      <CardContent className="p-5 pt-6 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${cfg.bg} ${cfg.color}`}>
              {cfg.icon}
            </div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <div className="flex gap-1">
            {copyValue && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCopy} title="Kopieren">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            )}
            {onReset && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onReset} title="Zurücksetzen">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Status badge for errors/warnings */}
        {isError && statusMessage && (
          <div className={`flex items-center gap-2.5 ${cfg.bg} ${cfg.color} p-3 rounded-lg border ${cfg.border}`}>
            {cfg.icon}
            <span className="font-medium text-sm">{statusMessage}</span>
          </div>
        )}

        {/* Main result */}
        {result && !isError && (
          <div className="bg-background/60 backdrop-blur-sm shadow-inner rounded-xl p-5 border border-border/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="text-2xl md:text-3xl font-bold text-foreground break-all leading-relaxed relative z-10">
              {result}
            </div>
          </div>
        )}

        {/* Steps / Formula */}
        {steps && (
          <div className="bg-muted/30 p-4 rounded-xl border border-border/40">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary inline-block" />
              Rechenweg / Formel
            </h4>
            <div className="text-sm overflow-x-auto">
              {steps}
            </div>
          </div>
        )}

        {/* Interpretation */}
        {interpretation && !isError && (
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <h4 className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary inline-block" />
              Interpretation
            </h4>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {interpretation}
            </div>
          </div>
        )}

        {/* Hints */}
        {hints && hints.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {hints.map((hint, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3 mt-0.5 shrink-0 text-blue-400/70" />
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}

        {/* Graph CTA */}
        {graphLink && !isError && (
          <Link
            href={graphLink}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl text-sm font-medium h-9 px-4 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors"
          >
            <LineChart className="w-4 h-4" />
            Im Graphen anzeigen
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
