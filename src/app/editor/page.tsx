"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MathDisplay } from "@/components/MathDisplay";
import { PenTool, Copy, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// EXAMPLES moved inside component to use t()

export default function EditorPage() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const EXAMPLES = [
    { label: t('editor.exQuad'), value: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
    { label: t('editor.exGaussInt'), value: "\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" },
    { label: t('editor.exFrac'), value: "f(x) = \\sqrt{\\frac{x^2 + 1}{x - 1}}" },
    { label: t('editor.exGaussSum'), value: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" },
    { label: t('editor.exEuler'), value: "e^{i\\pi} + 1 = 0" },
    { label: t('editor.exBinom'), value: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}" },
  ];

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 py-4 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('editor.title')}</h1>
        <p className="text-muted-foreground">{t('editor.desc')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-4 h-full">
        {/* Input Panel */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm mb-1 uppercase tracking-wider">
            <PenTool className="w-4 h-4 text-primary" />
            {t('editor.input')}
          </div>
          
          <Input 
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`${t('common.eg')} f(x) = \\frac{x^2}{2} + \\sqrt{y}`}
            className="font-mono text-base md:text-lg p-5 h-20 shadow-sm"
          />
          
          <p className="text-xs text-muted-foreground/80 pl-1">
            {t('editor.hint')}
          </p>

          <div className="mt-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 pl-1">{t('editor.commonScenarios')}</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 bg-muted/10 border-border/40 hover:bg-muted/30 shadow-sm transition-colors"
                  onClick={() => setText(ex.value)}
                >
                  {ex.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('editor.output')}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30" 
              onClick={handleCopy}
              disabled={!text}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? t('common.copied') : t('common.copyLaTeX')}
            </Button>
          </div>
          
          <div className="flex-1 bg-background rounded-lg border border-border/50 shadow-inner flex flex-col min-h-[300px]">
            {text.trim() ? (
              <div className="flex-1 p-8 flex items-center justify-center text-3xl">
                <MathDisplay math={text} block />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                <Sparkles className="w-8 h-8 opacity-50" />
                <span className="text-sm font-medium">{t('editor.preview')}</span>
                <span className="text-xs opacity-80">{t('editor.previewHint')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
