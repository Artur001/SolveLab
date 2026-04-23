"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { MathDisplay } from "@/components/MathDisplay";
import { ScaleIcon, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function GleichungenPage() {
  const { t } = useLanguage();
  const [qa, setQa] = useState("");
  const [qb, setQb] = useState("");
  const [qc, setQc] = useState("");
  const [qRes, setQRes] = useState<{x1?: string, x2?: string, error?: string, discriminant?: number, steps?: string, interpretation?: string} | null>(null);

  const [lm, setLm] = useState("");
  const [lq, setLq] = useState("");
  const [lRes, setLRes] = useState<{x?: string, error?: string, steps?: string, interpretation?: string} | null>(null);

  const solveQuadratic = () => {
    const a = parseFloat(qa);
    const b = parseFloat(qb);
    const c = parseFloat(qc);
    
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setQRes({ error: t('gleichungen.invalid') });
      return;
    }
    if (a === 0) {
      setQRes({ error: t('gleichungen.errorAnotZero') });
      return;
    }

    const d = b * b - 4 * a * c;
    const steps = `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${d}`;
    
    if (d < 0) {
      setQRes({ 
        error: t('gleichungen.errorNoRealSolutions'), 
        discriminant: d,
        steps,
        interpretation: t('gleichungen.interpretNegD')
      });
    } else if (d === 0) {
      const x = -b / (2 * a);
      setQRes({ 
        x1: x.toString(), 
        discriminant: d,
        steps: `${steps} \\\\ x = \\frac{-b}{2a} = \\frac{${-b}}{${2*a}} = ${x}`,
        interpretation: t('gleichungen.interpretZeroD')
      });
    } else {
      const x1 = (-b + Math.sqrt(d)) / (2 * a);
      const x2 = (-b - Math.sqrt(d)) / (2 * a);
      setQRes({ 
        x1: x1.toFixed(6).replace(/\.?0+$/, ''),
        x2: x2.toFixed(6).replace(/\.?0+$/, ''),
        discriminant: d,
        steps: `${steps} \\\\ x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{${-b} \\pm \\sqrt{${d}}}{${2*a}}`,
        interpretation: t('gleichungen.interpretPosD')
      });
    }
  };

  const solveLinear = () => {
    const m = parseFloat(lm);
    const q = parseFloat(lq);

    if (isNaN(m) || isNaN(q)) {
      setLRes({ error: t('gleichungen.invalid') });
      return;
    }
    if (m === 0) {
      setLRes({ error: t('gleichungen.errorMnotZero') });
      return;
    }

    const x = -q / m;
    const xStr = x.toFixed(6).replace(/\.?0+$/, '');
    setLRes({ 
      x: xStr,
      steps: `${m}x + ${q} = 0 \\\\ ${m}x = ${-q} \\\\ x = \\frac{${-q}}{${m}} = ${xStr}`,
      interpretation: t('gleichungen.interpretLinear')
    });
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('gleichungen.title')}</h1>
        <p className="text-muted-foreground">{t('gleichungen.desc')}</p>
      </div>

      <div className="flex flex-col gap-12 mt-4 max-w-3xl">
        
        {/* Quadratic Section */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-border/40 pb-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
              <ScaleIcon className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">{t('gleichungen.quad')}</h2>
            <span className="text-xs font-mono text-muted-foreground ml-auto bg-muted/20 px-2 py-0.5 rounded">ax² + bx + c = 0</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <Input placeholder="a" value={qa} onChange={e => setQa(e.target.value)} className="w-20 text-center font-mono shadow-sm h-10 bg-background" />
              <span className="text-muted-foreground font-mono text-sm font-medium">x² +</span>
              <Input placeholder="b" value={qb} onChange={e => setQb(e.target.value)} className="w-20 text-center font-mono shadow-sm h-10 bg-background" />
              <span className="text-muted-foreground font-mono text-sm font-medium">x +</span>
              <Input placeholder="c" value={qc} onChange={e => setQc(e.target.value)} className="w-20 text-center font-mono shadow-sm h-10 bg-background" />
              <span className="text-muted-foreground font-mono text-sm font-medium">= 0</span>
            </div>
            
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mr-2">{t('common.scenarios')}</span>
              <Button variant="outline" size="sm" onClick={() => {setQa("1"); setQb("2"); setQc("-3"); setQRes(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">x² + 2x − 3</Button>
              <Button variant="outline" size="sm" onClick={() => {setQa("1"); setQb("-4"); setQc("4"); setQRes(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">x² − 4x + 4</Button>
              <Button variant="outline" size="sm" onClick={() => {setQa("2"); setQb("1"); setQc("3"); setQRes(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">{t('gleichungen.noSolution')}</Button>
              <div className="flex-1" />
              <Button onClick={solveQuadratic} size="sm" className="w-32 shadow-sm">{t('common.calculate')}</Button>
            </div>

            {qRes ? (
              <ResultCard
                title={qRes.error ? t('gleichungen.noRealSolution') : t('gleichungen.solutionSet')}
                status={qRes.error ? "non_real" : "success"}
                statusMessage={qRes.error}
                result={!qRes.error ? (
                  <div className="flex flex-col gap-1.5">
                    {qRes.x1 !== undefined && <span className="font-mono text-lg">x₁ = <span className="text-primary font-bold">{qRes.x1}</span></span>}
                    {qRes.x2 !== undefined && <span className="font-mono text-lg">x₂ = <span className="text-primary font-bold">{qRes.x2}</span></span>}
                    {qRes.discriminant !== undefined && (
                      <span className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-wider">{t('gleichungen.discriminantValue')} {qRes.discriminant}</span>
                    )}
                  </div>
                ) : undefined}
                steps={qRes.steps ? <MathDisplay math={qRes.steps} block /> : undefined}
                interpretation={qRes.interpretation}
                copyValue={qRes.x1 ? `x₁ = ${qRes.x1}${qRes.x2 ? `, x₂ = ${qRes.x2}` : ''}` : undefined}
                graphLink={!qRes.error ? `/graphen?expr=${qa}x^2%2B${qb}x%2B${qc}` : undefined}
                onReset={() => { setQa(""); setQb(""); setQc(""); setQRes(null); }}
              />
            ) : (
              <div className="flex items-start gap-3 mt-2 p-3.5 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">i</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary/90">{t('gleichungen.discriminantHintTitle')}</p>
                  <p className="text-xs text-primary/70 mt-0.5 leading-relaxed">{t('gleichungen.discriminantHintDesc')}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Linear Section */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-border/40 pb-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">{t('gleichungen.linear')}</h2>
            <span className="text-xs font-mono text-muted-foreground ml-auto bg-muted/20 px-2 py-0.5 rounded">m·x + q = 0</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <Input placeholder="m" value={lm} onChange={e => setLm(e.target.value)} className="w-20 text-center font-mono shadow-sm h-10 bg-background" />
              <span className="text-muted-foreground font-mono text-sm font-medium">x +</span>
              <Input placeholder="q" value={lq} onChange={e => setLq(e.target.value)} className="w-20 text-center font-mono shadow-sm h-10 bg-background" />
              <span className="text-muted-foreground font-mono text-sm font-medium">= 0</span>
            </div>
            
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mr-2">{t('common.scenarios')}</span>
              <Button variant="outline" size="sm" onClick={() => {setLm("2"); setLq("-4"); setLRes(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">2x − 4</Button>
              <Button variant="outline" size="sm" onClick={() => {setLm("-0.5"); setLq("3"); setLRes(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">−0.5x + 3</Button>
              <div className="flex-1" />
              <Button onClick={solveLinear} size="sm" className="w-32 shadow-sm">{t('common.calculate')}</Button>
            </div>
            
            {lRes ? (
              <ResultCard
                title={lRes.error ? t('gleichungen.invalidInput') : t('gleichungen.solutionSet')}
                status={lRes.error ? "invalid" : "success"}
                statusMessage={lRes.error}
                result={!lRes.error ? (
                  <span className="font-mono text-lg">x = <span className="text-primary font-bold">{lRes.x}</span></span>
                ) : undefined}
                steps={lRes.steps ? <MathDisplay math={lRes.steps} block /> : undefined}
                interpretation={lRes.interpretation}
                copyValue={lRes.x ? `x = ${lRes.x}` : undefined}
                graphLink={!lRes.error ? `/graphen?expr=${lm}x%2B${lq}` : undefined}
                onReset={() => { setLm(""); setLq(""); setLRes(null); }}
              />
            ) : (
              <div className="flex items-start gap-3 mt-2 p-3.5 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">i</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary/90">{t('gleichungen.rootsHintTitle')}</p>
                  <p className="text-xs text-primary/70 mt-0.5 leading-relaxed">{t('gleichungen.rootsHintDesc')}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
