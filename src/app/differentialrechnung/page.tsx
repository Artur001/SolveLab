"use client";

import { useState } from "react";
import { derivative, evaluate } from "mathjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { MathDisplay } from "@/components/MathDisplay";
import { Sigma } from "lucide-react";

export default function DifferentialrechnungPage() {
  const { t } = useLanguage();
  const [func, setFunc] = useState("");
  const [varName, setVarName] = useState("x");
  const [pointA, setPointA] = useState("");
  
  const [result, setResult] = useState<{
    derivative: string;
    f_a?: number;
    f_prime_a?: number;
    tangent?: string;
    normal?: string;
  } | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  const calculateDerivative = () => {
    try {
      setError(null);
      const derivNode = derivative(func, varName);
      const derivStr = derivNode.toString();
      
      let f_a, f_prime_a, tangent, normal;

      if (pointA.trim() !== "") {
        const aVal = parseFloat(pointA);
        if (!isNaN(aVal)) {
          f_a = evaluate(func, { [varName]: aVal });
          f_prime_a = derivNode.evaluate({ [varName]: aVal });
          
          tangent = `${f_prime_a} \\cdot (x - ${aVal}) + ${f_a}`;
          
          if (f_prime_a !== 0) {
             const m_n = -1 / f_prime_a;
             normal = `${m_n.toFixed(4)} \\cdot (x - ${aVal}) + ${f_a}`;
          }
        }
      }

      setResult({ derivative: derivStr, f_a, f_prime_a, tangent, normal });
    } catch (e) {
      setError(t('differential.invalid'));
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('differential.title')}</h1>
        <p className="text-muted-foreground">{t('differential.desc')}</p>
      </div>

      <div className="flex flex-col gap-8 mt-4 max-w-3xl">
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/40 pb-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
              <Sigma className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">{t('differential.calc')}</h2>
            <span className="text-xs text-muted-foreground ml-auto uppercase tracking-wider">{t('differential.hint')}</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 bg-muted/5 p-5 rounded-xl border border-border/40">
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-muted-foreground text-sm">f(</span>
                <Input 
                  className="w-14 text-center font-mono bg-background shadow-sm h-10 border-border/50" 
                  value={varName} 
                  onChange={e => setVarName(e.target.value)} 
                  placeholder="x"
                />
                <span className="font-semibold text-muted-foreground text-sm">) =</span>
                <Input 
                  className="flex-1 font-mono bg-background shadow-sm h-10 border-border/50"
                  value={func} 
                  onChange={e => setFunc(e.target.value)} 
                  placeholder={`${t('common.eg')} x^2 + 2*x`}
                  onKeyDown={e => e.key === "Enter" && calculateDerivative()}
                />
              </div>

              <div className="flex gap-2 items-center mt-2 border-t border-border/30 pt-3">
                <span className="font-medium text-[11px] uppercase tracking-wider text-muted-foreground/80">{t('differential.evalAt')}</span>
                <div className="flex-1" />
                <span className="text-sm font-mono font-medium text-muted-foreground">{varName} =</span>
                <Input 
                  className="w-24 font-mono bg-background shadow-sm h-9 border-border/50 text-center"
                  value={pointA} 
                  onChange={e => setPointA(e.target.value)} 
                  placeholder={`${t('common.eg')} 2`}
                  onKeyDown={e => e.key === "Enter" && calculateDerivative()}
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mr-2">{t('common.scenarios')}</span>
              <Button variant="outline" size="sm" onClick={() => {setFunc("sin(x)"); setVarName("x"); setPointA("0"); setResult(null); setError(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">sin(x) @ x=0</Button>
              <Button variant="outline" size="sm" onClick={() => {setFunc("x^3 - 2*x"); setVarName("x"); setPointA("2"); setResult(null); setError(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">x³ − 2x @ x=2</Button>
              <Button variant="outline" size="sm" onClick={() => {setFunc("e^x"); setVarName("x"); setPointA("1"); setResult(null); setError(null);}} className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30">eˣ @ x=1</Button>
              <div className="flex-1" />
              <Button onClick={calculateDerivative} size="sm" className="w-32 shadow-sm">{t('differential.derive')}</Button>
            </div>
          </div>
        </section>

        <section>
          {error && (
            <ResultCard title={t('common.error')} status="invalid" statusMessage={error} onReset={() => { setError(null); }} />
          )}

          {result ? (
            <div className="flex flex-col gap-6">
              <ResultCard
                title={t('differential.firstDerivative')}
                result={
                  <div className="font-mono text-2xl flex items-baseline gap-3 tracking-tight">
                    <span className="text-muted-foreground/60 text-lg">f&apos;({varName}) =</span>
                    <span className="text-primary font-bold">{result.derivative}</span>
                  </div>
                }
                steps={<MathDisplay math={`f'(${varName}) = \\frac{d}{d${varName}} \\left( ${func} \\right)`} block />}
                interpretation={t('differential.firstDerivInterp')}
                copyValue={`f'(${varName}) = ${result.derivative}`}
                graphLink={`/graphen?expr=${func}`}
              />

              {result.tangent && (
                <ResultCard
                  title={`${t('differential.tangentAt')} ${varName} = ${pointA}`}
                  result={<MathDisplay math={`t(x) = ${result.tangent}`} block />}
                  steps={
                    <div className="flex flex-col gap-2">
                      <MathDisplay math={`f(${pointA}) = ${result.f_a}`} block />
                      <MathDisplay math={`m = f'(${pointA}) = ${result.f_prime_a}`} block />
                      <MathDisplay math={`t(x) = m \\cdot (x - ${pointA}) + f(${pointA})`} block />
                    </div>
                  }
                  interpretation={`An der Stelle ${varName} = ${pointA} hat die Kurve eine Steigung von ${result.f_prime_a}.`}
                  hints={[`Funktionswert: f(${pointA}) = ${result.f_a}`, `Steigung: m = ${result.f_prime_a}`]}
                />
              )}

              {result.normal && (
                <ResultCard
                  title={`${t('differential.normalAt')} ${varName} = ${pointA}`}
                  result={<MathDisplay math={`n(x) = ${result.normal}`} block />}
                  steps={<MathDisplay math={`m_n = -\\frac{1}{m} = -\\frac{1}{${result.f_prime_a}}`} block />}
                  interpretation="Die Normale steht senkrecht auf der Tangente im Berührpunkt."
                />
              )}
            </div>
          ) : !error && (
            <div className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-muted/5 border border-border/40">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">i</div>
              </div>
              <div>
                <p className="text-sm font-medium">{t('differential.hintsTitle')}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t('differential.hintsDesc')}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
