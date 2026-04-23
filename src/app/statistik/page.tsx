"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { BarChart3 } from "lucide-react";

export default function StatistikPage() {
  const { t } = useLanguage();
  const [dataInput, setDataInput] = useState("");
  const [results, setResults] = useState<{ 
    mean: number; 
    median: number; 
    variance: number; 
    stdDev: number;
    count: number;
    min: number;
    max: number;
    range: number;
    sorted: number[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = () => {
    setError(null);
    const rawData = dataInput.split(/[,;\s]+/).map(s => parseFloat(s)).filter(n => !isNaN(n));
    if (rawData.length === 0) {
      setError(t('common.atLeastOne'));
      return;
    }
    if (rawData.length === 1) {
      setError(t('common.atLeastTwo'));
      return;
    }

    const n = rawData.length;
    const mean = rawData.reduce((a, b) => a + b, 0) / n;

    const sorted = [...rawData].sort((a, b) => a - b);
    let median = 0;
    if (n % 2 === 0) {
      median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    } else {
      median = sorted[Math.floor(n / 2)];
    }

    const variance = rawData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[n - 1];

    setResults({ mean, median, variance, stdDev, count: n, min, max, range: max - min, sorted });
  };

  const StatBox = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col gap-1 bg-muted/10 rounded-xl p-3.5 border border-border/50 shadow-sm">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-xl font-bold text-foreground tabular-nums">{typeof value === 'number' ? value.toFixed(4).replace(/\.?0+$/, '') : value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('statistik.title')}</h1>
        <p className="text-muted-foreground">{t('statistik.desc')}</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>{t('statistik.ungrouped')}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{t('statistik.hint')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="bg-muted/20 p-2 rounded-xl border border-border/50 shadow-inner">
            <Input 
              placeholder={`${t('common.eg')} 2, 4, 4, 4, 5, 5, 7, 9`} 
              value={dataInput} 
              onChange={(e) => setDataInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && calculateStats()} 
              className="font-mono border-transparent bg-background shadow-sm h-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => {setDataInput("2, 3, 2, 1, 4, 2, 3"); setResults(null); setError(null);}} className="text-xs h-7">{t('common.example')} {t('statistik.exGrades')}</Button>
            <Button variant="secondary" size="sm" onClick={() => {setDataInput("12.5, 14.2, 11.0, 15.1, 13.8, 12.9"); setResults(null); setError(null);}} className="text-xs h-7">{t('common.example')} {t('statistik.exTemps')}</Button>
            <Button variant="secondary" size="sm" onClick={() => {setDataInput("45000, 52000, 38000, 61000, 47000, 55000"); setResults(null); setError(null);}} className="text-xs h-7">{t('common.example')} {t('statistik.exSalaries')}</Button>
          </div>
          
          <Button onClick={calculateStats} className="w-full">{t('common.calculate')}</Button>

          {error && (
            <ResultCard
              title={t('common.error')}
              status="invalid"
              statusMessage={error}
              onReset={() => { setDataInput(""); setResults(null); setError(null); }}
            />
          )}

          {results ? (
            <ResultCard
              title={t('statistik.evaluation')}
              result={
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatBox label={t('statistik.mean')} value={results.mean} />
                  <StatBox label={t('statistik.median')} value={results.median} />
                  <StatBox label={t('statistik.variance')} value={results.variance} />
                  <StatBox label={t('statistik.stddev')} value={results.stdDev} />
                  <StatBox label={t('statistik.count')} value={results.count} />
                  <StatBox label={t('statistik.min')} value={results.min} />
                  <StatBox label={t('statistik.max')} value={results.max} />
                  <StatBox label={t('statistik.range')} value={results.range} />
                </div>
              }
              steps={
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">{t('statistik.sorted')}</span>
                  <span className="font-mono text-sm bg-background/50 px-2 py-1 rounded">{results.sorted.join(", ")}</span>
                </div>
              }
              interpretation={`Der Datensatz enthält ${results.count} Werte. Der Mittelwert (x̄ = ${results.mean.toFixed(2)}) und der Median (${results.median.toFixed(2)}) ${Math.abs(results.mean - results.median) < results.stdDev * 0.1 ? 'liegen nah beieinander, was auf eine symmetrische Verteilung hindeutet.' : 'weichen voneinander ab, was auf eine schiefe Verteilung hindeutet.'}`}
              copyValue={`n=${results.count}, x̄=${results.mean.toFixed(4)}, Median=${results.median.toFixed(4)}, σ²=${results.variance.toFixed(4)}, σ=${results.stdDev.toFixed(4)}`}
              onReset={() => { setDataInput(""); setResults(null); setError(null); }}
            />
          ) : !error && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground/60 mb-2">
                <BarChart3 className="w-4 h-4" />
                <span>{t('statistik.preview')}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 opacity-30 grayscale pointer-events-none">
                <StatBox label={t('statistik.mean')} value="-" />
                <StatBox label={t('statistik.median')} value="-" />
                <StatBox label={t('statistik.variance')} value="-" />
                <StatBox label={t('statistik.stddev')} value="-" />
                <StatBox label={t('statistik.count')} value="-" />
                <StatBox label={t('statistik.min')} value="-" />
                <StatBox label={t('statistik.max')} value="-" />
                <StatBox label={t('statistik.range')} value="-" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
