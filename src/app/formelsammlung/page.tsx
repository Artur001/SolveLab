"use client";

import { useState } from "react";
import { getFormulas } from "@/data/formulas";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MathDisplay } from "@/components/MathDisplay";
import { Search, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function FormelsammlungPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");

  const formulas = getFormulas(lang);

  const filteredFormulas = formulas.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filteredFormulas.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<string, typeof formulas>);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('formelsammlung.title')}</h1>
        <p className="text-muted-foreground">{t('formelsammlung.desc')}</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('formelsammlung.search')}
          className="pl-9 bg-card"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-10 mt-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2 text-primary">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((formula) => (
                <Card key={formula.id} className="flex flex-col hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg">{formula.title}</CardTitle>
                      <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                        {formula.type === 'compute' ? t('formelsammlung.typeCompute') :
                         formula.type === 'solve' ? t('formelsammlung.typeSolve') :
                         formula.type === 'graph' ? t('formelsammlung.typeGraph') :
                         t('formelsammlung.typeReference')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{formula.subcategory}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <p className="text-sm">{formula.description}</p>
                    
                    <div className="bg-muted/20 p-4 rounded-xl flex items-center justify-center min-h-[80px] overflow-x-auto overflow-y-hidden border border-border/30 shadow-inner">
                      <MathDisplay math={formula.latex} block />
                    </div>

                    {formula.example && (
                      <div className="text-xs bg-primary/10 text-primary p-2 rounded border border-primary/20">
                        <span className="font-semibold">{t('formelsammlung.example')}: </span> {formula.example}
                      </div>
                    )}
                    
                    {formula.variables && (
                      <div className="text-xs text-muted-foreground mt-auto">
                        {t('formelsammlung.variables')}: {formula.variables.join(", ")}
                      </div>
                    )}
                  </CardContent>
                  {formula.actionLink && (
                    <CardFooter className="pt-0 pb-4 px-6 mt-auto border-t border-border/30">
                      <Link href={formula.actionLink} className="inline-flex items-center justify-center w-full mt-3 gap-2 rounded-xl px-3 h-9 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/15 border border-primary/20 transition-colors">
                          {formula.type === 'graph' ? t('formelsammlung.plot') : 
                           formula.type === 'solve' ? t('formelsammlung.solve') : 
                           t('formelsammlung.calc')}
                          <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground/50">
            <Search className="w-8 h-8" />
            <p className="text-sm">{t('formelsammlung.empty')} &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
