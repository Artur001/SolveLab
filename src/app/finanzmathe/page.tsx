"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MathDisplay } from "@/components/MathDisplay";
import { ResultCard } from "@/components/ResultCard";
import { Landmark, PiggyBank } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FinanzmathePage() {
  const { t } = useLanguage();
  const [K0, setK0] = useState("");
  const [p, setP] = useState("");
  const [n, setN] = useState("");
  const [R, setR] = useState("");

  const [zinseszinsRes, setZinseszinsRes] = useState<{ K_n: number, steps: string, gewinn: number } | null>(null);
  const [renteVorRes, setRenteVorRes] = useState<{ value: number, steps: string } | null>(null);
  const [renteNachRes, setRenteNachRes] = useState<{ value: number, steps: string } | null>(null);

  const [zinsError, setZinsError] = useState<string | null>(null);
  const [renteError, setRenteError] = useState<string | null>(null);

  const calcZinseszins = () => {
    setZinsError(null);
    setZinseszinsRes(null);
    const k = parseFloat(K0.replace(",", "."));
    const pr = parseFloat(p.replace(",", "."));
    const yrs = parseFloat(n.replace(",", "."));

    if (isNaN(k) || isNaN(pr) || isNaN(yrs)) {
      setZinsError(t('common.invalidInput'));
      return;
    }
    if (k < 0 || yrs < 0) {
      setZinsError(t('common.positiveValues'));
      return;
    }

    const q = 1 + pr / 100;
    const K_n = k * Math.pow(q, yrs);
    const gewinn = K_n - k;

    setZinseszinsRes({
      K_n,
      gewinn,
      steps: `q = 1 + \\frac{p}{100} = 1 + \\frac{${pr}}{100} = ${q} \\\\ K_n = K_0 \\cdot q^n = ${k} \\cdot ${q}^{${yrs}} = ${K_n.toFixed(2)}`
    });
  };

  const calcRenten = () => {
    setRenteError(null);
    setRenteVorRes(null);
    setRenteNachRes(null);

    const rate = parseFloat(R.replace(",", "."));
    const pr = parseFloat(p.replace(",", "."));
    const yrs = parseFloat(n.replace(",", "."));

    if (isNaN(rate) || isNaN(pr) || isNaN(yrs)) {
      setRenteError(t('common.invalidInput'));
      return;
    }
    if (rate <= 0) { setRenteError(t('common.positiveRate')); return; }

    const q = 1 + pr / 100;

    const vor = rate * q * ((Math.pow(q, yrs) - 1) / (q - 1));
    setRenteVorRes({
      value: vor,
      steps: `q = ${q} \\\\ K_n = R \\cdot q \\cdot \\frac{q^n - 1}{q - 1} = ${rate} \\cdot ${q} \\cdot \\frac{${q}^{${yrs}} - 1}{${q} - 1} = ${vor.toFixed(2)}`
    });

    const nach = rate * ((Math.pow(q, yrs) - 1) / (q - 1));
    setRenteNachRes({
      value: nach,
      steps: `q = ${q} \\\\ K_n = R \\cdot \\frac{q^n - 1}{q - 1} = ${rate} \\cdot \\frac{${q}^{${yrs}} - 1}{${q} - 1} = ${nach.toFixed(2)}`
    });
  };

  const ValLabel = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5 bg-muted/10 p-3 rounded-xl border border-border/50">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('finanzmathe.title')}</h1>
        <p className="text-muted-foreground">{t('finanzmathe.desc')}</p>
      </div>

      <div className="flex flex-col gap-12 mt-4 max-w-4xl">
        {/* Zinseszins */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/40 pb-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">{t('finanzmathe.compound')}</h2>
            <span className="text-xs text-muted-foreground ml-auto uppercase tracking-wider">{t('finanzmathe.compoundHint')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="col-span-1 md:col-span-5 flex flex-col gap-4 bg-muted/5 p-5 rounded-xl border border-border/40">
              <ValLabel label={t('finanzmathe.k0Label')}>
                <div className="relative">
                  <Input placeholder={`${t('common.eg')} 1000`} value={K0} onChange={e => setK0(e.target.value)} className="font-mono pr-8 bg-background shadow-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                </div>
              </ValLabel>
              <ValLabel label={t('finanzmathe.pLabel')}>
                <div className="relative">
                  <Input placeholder={`${t('common.eg')} 2`} value={p} onChange={e => setP(e.target.value)} className="font-mono pr-8 bg-background shadow-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </ValLabel>
              <ValLabel label={t('finanzmathe.nLabel')}>
                <div className="relative">
                  <Input placeholder={`${t('common.eg')} 5`} value={n} onChange={e => setN(e.target.value)} className="font-mono pr-8 bg-background shadow-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{t('finanzmathe.yearsSuffix') || 'Y'}</span>
                </div>
              </ValLabel>
              
              <div className="flex gap-2 flex-wrap mt-1">
                <Button variant="outline" size="sm" onClick={() => {setK0("1000"); setP("2"); setN("5"); setZinseszinsRes(null); setZinsError(null);}} className="text-xs h-7 bg-background">{t('common.example')} {t('finanzmathe.savingsBook')}</Button>
                <Button variant="outline" size="sm" onClick={() => {setK0("5000"); setP("4.5"); setN("10"); setZinseszinsRes(null); setZinsError(null);}} className="text-xs h-7 bg-background">{t('common.example')} {t('finanzmathe.investment')}</Button>
              </div>
              
              <Button onClick={calcZinseszins} className="w-full mt-2 shadow-sm">{t('common.calculate')}</Button>
            </div>

            <div className="col-span-1 md:col-span-7 flex flex-col">
              {zinsError && (
                <ResultCard title={t('common.error')} status="invalid" statusMessage={zinsError} onReset={() => setZinsError(null)} />
              )}

              {zinseszinsRes ? (
                <ResultCard
                  title={t('finanzmathe.end')}
                  result={
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary tabular-nums tracking-tight">{zinseszinsRes.K_n.toFixed(2)} €</span>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground mt-2 bg-muted/20 p-3 rounded-lg border border-border/50">
                        <span className="flex flex-col"><span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">{t('finanzmathe.profit')}</span><span className="text-emerald-500 font-bold tabular-nums">+{zinseszinsRes.gewinn.toFixed(2)} €</span></span>
                        <span className="flex flex-col"><span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">{t('finanzmathe.returnRate')}</span><span className="text-emerald-500 font-bold tabular-nums">+{((zinseszinsRes.gewinn / parseFloat(K0)) * 100).toFixed(1)}%</span></span>
                      </div>
                    </div>
                  }
                  steps={<MathDisplay math={zinseszinsRes.steps} block />}
                  interpretation="Dies ist das Gesamtkapital nach Ablauf der Verzinsungsdauer, inklusive aller Zinseszinsen."
                  copyValue={`Endkapital: ${zinseszinsRes.K_n.toFixed(2)} €`}
                  onReset={() => { setK0(""); setP(""); setN(""); setZinseszinsRes(null); }}
                />
              ) : !zinsError && (
                <div className="flex items-start gap-3 mt-2 p-4 rounded-xl bg-muted/5 border border-border/40 h-full">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">i</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('finanzmathe.compoundEffectTitle')}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t('finanzmathe.compoundEffectDesc')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Rente */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/40 pb-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">{t('finanzmathe.rent')}</h2>
            <span className="text-xs text-muted-foreground ml-auto uppercase tracking-wider">{t('finanzmathe.rentHint')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="col-span-1 md:col-span-5 flex flex-col gap-4 bg-muted/5 p-5 rounded-xl border border-border/40">
              <ValLabel label={t('finanzmathe.rLabel')}>
                <div className="relative">
                  <Input placeholder={`${t('common.eg')} 200`} value={R} onChange={e => setR(e.target.value)} className="font-mono pr-8 bg-background shadow-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                </div>
              </ValLabel>
              <ValLabel label={t('finanzmathe.pLabel')}>
                <div className="relative">
                  <Input placeholder={`${t('common.eg')} 3`} value={p} onChange={e => setP(e.target.value)} className="font-mono pr-8 bg-background shadow-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </ValLabel>
              <ValLabel label={t('finanzmathe.nLabel')}>
                <div className="relative">
                  <Input placeholder={`${t('common.eg')} 10`} value={n} onChange={e => setN(e.target.value)} className="font-mono pr-8 bg-background shadow-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{t('finanzmathe.yearsSuffix') || 'Y'}</span>
                </div>
              </ValLabel>
              
              <div className="flex gap-2 flex-wrap mt-1">
                <Button variant="outline" size="sm" onClick={() => {setR("200"); setP("3"); setN("10"); setRenteVorRes(null); setRenteNachRes(null); setRenteError(null);}} className="text-xs h-7 bg-background">{t('common.example')} {t('finanzmathe.savingsPlan')}</Button>
                <Button variant="outline" size="sm" onClick={() => {setR("50"); setP("1.5"); setN("5"); setRenteVorRes(null); setRenteNachRes(null); setRenteError(null);}} className="text-xs h-7 bg-background">{t('common.example')} {t('finanzmathe.smallLoan')}</Button>
              </div>
              
              <Button onClick={calcRenten} className="w-full mt-2 shadow-sm">{t('common.calculate')}</Button>
            </div>

            <div className="col-span-1 md:col-span-7 flex flex-col">
              {renteError && (
                <ResultCard title={t('common.error')} status="invalid" statusMessage={renteError} onReset={() => setRenteError(null)} />
              )}

              {renteVorRes && renteNachRes ? (
                <div className="flex flex-col gap-4">
                  <ResultCard
                    title={t('finanzmathe.vor')}
                    result={
                      <span className="text-2xl font-bold text-primary tabular-nums tracking-tight">{renteVorRes.value.toFixed(2)} €</span>
                    }
                    steps={<MathDisplay math={renteVorRes.steps} block />}
                    interpretation="Vorschüssige Rente: Raten werden zu Beginn der Periode gezahlt und generieren sofort Zinsen."
                    copyValue={`Vorschüssig: ${renteVorRes.value.toFixed(2)} €`}
                  />
                  <ResultCard
                    title={t('finanzmathe.nach')}
                    result={
                      <span className="text-2xl font-bold text-primary tabular-nums tracking-tight">{renteNachRes.value.toFixed(2)} €</span>
                    }
                    steps={<MathDisplay math={renteNachRes.steps} block />}
                    interpretation="Nachschüssige Rente: Raten werden am Ende der Periode gezahlt."
                    hints={[`Differenz: ${(renteVorRes.value - renteNachRes.value).toFixed(2)} € zugunsten vorschüssiger Zahlung.`]}
                    copyValue={`Nachschüssig: ${renteNachRes.value.toFixed(2)} €`}
                  />
                </div>
              ) : !renteError && (
                <div className="flex items-start gap-3 mt-2 p-4 rounded-xl bg-muted/5 border border-border/40 h-full">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">i</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('finanzmathe.rentTypeTitle')}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t('finanzmathe.rentTypeDesc')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
