"use client";

import { useState } from "react";
import { combinations, permutations } from "mathjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { MathDisplay } from "@/components/MathDisplay";
import { Dice5 } from "lucide-react";

export default function KombinatorikPage() {
  const { t } = useLanguage();
  const [n, setN] = useState("");
  const [k, setK] = useState("");
  
  const [combRes, setCombRes] = useState<{ value: string, steps: string } | null>(null);
  const [permRes, setPermRes] = useState<{ value: string, steps: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const nn = parseInt(n);
    const kk = parseInt(k);
    
    if (isNaN(nn) || isNaN(kk) || nn < 0 || kk < 0) {
      setError(t('kombi.errNum'));
      return;
    }
    
    if (kk > nn) {
      setError(t('kombi.errK'));
      return;
    }

    if (nn > 170) {
      setError(t('kombi.errN'));
      return;
    }

    try {
      const c = Number(combinations(nn, kk));
      const p = Number(permutations(nn, kk));
      
      setCombRes({
        value: c.toLocaleString(),
        steps: `\\binom{n}{k} = \\frac{n!}{k!(n-k)!} = \\frac{${nn}!}{${kk}!(${nn}-${kk})!} = ${c.toLocaleString()}`
      });
      
      setPermRes({
        value: p.toLocaleString(),
        steps: `P(n,k) = \\frac{n!}{(n-k)!} = \\frac{${nn}!}{(${nn}-${kk})!} = ${p.toLocaleString()}`
      });
    } catch(e) {
      setError(t('kombi.errLarge'));
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('kombi.title')}</h1>
        <p className="text-muted-foreground">{t('kombi.desc')}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <Dice5 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>{t('kombi.draw')}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{t('kombi.hint')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{t('kombi.total')}</label>
              <Input type="number" value={n} onChange={e => setN(e.target.value)} className="font-mono" placeholder={`${t('common.eg')} 49`} />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{t('kombi.select')}</label>
              <Input type="number" value={k} onChange={e => setK(e.target.value)} className="font-mono" placeholder={`${t('common.eg')} 6`} />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => {setN("49"); setK("6"); setCombRes(null); setPermRes(null); setError(null);}} className="text-xs h-7">{t('common.example')} {t('kombi.exLotto')}</Button>
            <Button variant="secondary" size="sm" onClick={() => {setN("10"); setK("4"); setCombRes(null); setPermRes(null); setError(null);}} className="text-xs h-7">{t('common.example')} {t('kombi.exPin')}</Button>
            <Button variant="secondary" size="sm" onClick={() => {setN("52"); setK("5"); setCombRes(null); setPermRes(null); setError(null);}} className="text-xs h-7">{t('common.example')} {t('kombi.exPoker')}</Button>
          </div>

          <Button onClick={calculate} className="w-full">{t('common.calculate')}</Button>

          {error && (
            <ResultCard title={t('common.error')} status="invalid" statusMessage={error} onReset={() => { setError(null); setCombRes(null); setPermRes(null); }} />
          )}

          {combRes && permRes && !error ? (
            <div className="flex flex-col gap-4">
              <ResultCard
                title={t('kombi.comb')}
                result={
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary tabular-nums">{combRes.value}</span>
                    <span className="text-sm text-muted-foreground">{t('kombi.ways')}</span>
                  </div>
                }
                steps={<MathDisplay math={combRes.steps} block />}
                interpretation={t('kombi.interpComb')}
                copyValue={`C(${n},${k}) = ${combRes.value}`}
                onReset={() => { setN(""); setK(""); setCombRes(null); setPermRes(null); }}
              />
              <ResultCard
                title={t('kombi.perm')}
                result={
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary tabular-nums">{permRes.value}</span>
                    <span className="text-sm text-muted-foreground">{t('kombi.arrangements')}</span>
                  </div>
                }
                steps={<MathDisplay math={permRes.steps} block />}
                interpretation={t('kombi.interpPerm')}
                hints={[
                  t('kombi.hintComb'),
                  t('kombi.hintPerm')
                ]}
                copyValue={`P(${n},${k}) = ${permRes.value}`}
              />
            </div>
          ) : !error && (
            <EmptyState
              icon={<Dice5 className="w-5 h-5" />}
              title={t('kombi.emptyTitle')}
              description={t('kombi.emptyDesc')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
