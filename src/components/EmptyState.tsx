"use client";

import { Calculator, Info } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon,
  title = "Warte auf Eingabe…",
  description = "Gib Werte ein und klicke auf Berechnen, um das Ergebnis zu sehen.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 rounded-xl border-2 border-dashed border-border/40 bg-muted/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/10 pointer-events-none" />
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-background shadow-sm border border-border/50 text-muted-foreground/60 group-hover:scale-105 group-hover:text-primary/70 transition-all duration-500 relative z-10">
        {icon || <Calculator className="w-5 h-5" />}
      </div>
      <div className="text-center relative z-10">
        <p className="text-sm font-semibold text-foreground/70">{title}</p>
        <p className="text-xs text-muted-foreground/50 mt-1 max-w-[280px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
