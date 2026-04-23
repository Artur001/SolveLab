"use client";

import { getFormulas } from "@/data/formulas";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathDisplay } from "@/components/MathDisplay";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CheatsheetPage() {
  const { t, lang } = useLanguage();
  const formulas = getFormulas(lang);
  const references = formulas.filter(f => f.type === "reference");

  // Group by category
  const grouped = references.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<string, typeof formulas>);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('cheatsheet.title')}</h1>
        <p className="text-muted-foreground">{t('cheatsheet.desc')}</p>
      </div>

      <div className="flex flex-col gap-10 mt-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2 text-primary">{category}</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {items.map((formula) => (
                <div key={formula.id} className="break-inside-avoid flex flex-col bg-muted/10 p-5 rounded-2xl border border-border/40 hover:bg-muted/20 hover:border-border/60 transition-colors shadow-sm">
                  <div className="pb-3">
                    <h3 className="text-base font-bold text-foreground/90">{formula.title}</h3>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">{formula.subcategory}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <p className="text-sm text-foreground/70 leading-relaxed">{formula.description}</p>
                    
                    <div className="bg-background/80 p-3 rounded-lg flex items-center justify-center overflow-x-auto shadow-inner border border-border/30">
                      <MathDisplay math={formula.latex} block />
                    </div>

                    {formula.example && (
                      <div className="text-[11px] bg-primary/5 text-primary/80 px-2.5 py-1.5 rounded-md border border-primary/10 mt-1">
                        <span className="font-semibold uppercase tracking-wider">{t('formelsammlung.example')}: </span> {formula.example}
                      </div>
                    )}
                  </div>
                  {formula.actionLink && (
                    <div className="pt-3 mt-3 border-t border-border/40">
                      <Link href={formula.actionLink} className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors gap-1.5 w-full">
                          {formula.type === 'graph' ? t('cheatsheet.plot') : 
                           formula.type === 'solve' ? t('cheatsheet.solve') : 
                           t('cheatsheet.calc')}
                          <ExternalLink className="w-3 h-3 ml-auto" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="text-muted-foreground">{t('cheatsheet.empty')}</div>
        )}
      </div>
    </div>
  );
}
