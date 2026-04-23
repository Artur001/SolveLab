"use client";

import { useEffect, useRef, useState } from "react";
import functionPlot from "function-plot";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Plus, Trash2, LineChart } from "lucide-react";

const COLORS = ["#818cf8", "#34d399", "#f97316", "#f472b6", "#facc15", "#22d3ee", "#a78bfa", "#fb7185"];

type FuncEntry = { id: number; expr: string; visible: boolean; color: string };

export default function GraphenPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [functions, setFunctions] = useState<FuncEntry[]>([
    { id: 1, expr: "x^2", visible: true, color: COLORS[0] },
    { id: 2, expr: "sin(x)", visible: true, color: COLORS[1] }
  ]);
  const [newFunc, setNewFunc] = useState("");
  const [graphError, setGraphError] = useState<string | null>(null);

  useEffect(() => {
    const expr = searchParams.get('expr');
    if (expr) {
      setFunctions([{ id: Date.now(), expr, visible: true, color: COLORS[0] }]);
    }
  }, [searchParams]);

  const drawGraph = () => {
    if (!containerRef.current) return;
    setGraphError(null);
    try {
      const activeFunctions = functions
        .filter(f => f.visible)
        .map(fn => ({ fn: fn.expr, color: fn.color }));
      
      containerRef.current.innerHTML = '';
      
      if (activeFunctions.length === 0) return;

      functionPlot({
        target: containerRef.current,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || 500,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [-10, 10] },
        grid: true,
        data: activeFunctions,
      });

      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        svg.style.overflow = "visible";
        
        // Subtle white grid lines
        const gridLines = svg.querySelectorAll('.grid .tick line');
        gridLines.forEach(p => p.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)'));
        
        // Slightly brighter white for the outer boundary
        const domains = svg.querySelectorAll('.domain');
        domains.forEach(p => p.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)'));

        // Bright white for the main origin axes (x=0, y=0)
        const originLines = svg.querySelectorAll('.origin');
        originLines.forEach(p => p.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)'));

        // Crisp white text for the coordinates
        const texts = svg.querySelectorAll('text');
        texts.forEach(t => {
          t.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
          t.style.fontWeight = '500';
        });

        // Thicken the function lines for better pop against dark background
        const lines = svg.querySelectorAll('.line');
        lines.forEach(l => l.setAttribute('stroke-width', '2.5'));
      }
    } catch (e: any) {
      setGraphError(e?.message || "Fehler beim Rendern des Graphen.");
    }
  };

  useEffect(() => {
    drawGraph();
    
    const handleResize = () => drawGraph();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [functions]);

  const addFunction = () => {
    if (!newFunc.trim()) return;
    const nextColor = COLORS[functions.length % COLORS.length];
    setFunctions([...functions, { id: Date.now(), expr: newFunc, visible: true, color: nextColor }]);
    setNewFunc("");
  };

  const removeFunction = (id: number) => {
    setFunctions(functions.filter((f) => f.id !== id));
  };

  const toggleFunction = (id: number) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  };

  const addPreset = (expr: string) => {
    const nextColor = COLORS[functions.length % COLORS.length];
    setFunctions([...functions, { id: Date.now(), expr, visible: true, color: nextColor }]);
  };

  return (
    <div className="flex flex-col gap-6 py-4 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('graphen.title')}</h1>
        <p className="text-muted-foreground">{t('graphen.desc')}</p>
      </div>

      <div className="flex gap-6 h-full min-h-[500px]">
        {/* Workspace Panel */}
        <div className="w-80 flex flex-col gap-4 h-full pr-6 border-r border-border/40">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">{t('graphen.functions')}</h3>
            <span className="text-xs text-muted-foreground ml-auto">{functions.filter(f => f.visible).length} {t('common.active')}</span>
          </div>
          
          <div className="flex gap-2">
            <Input 
              value={newFunc} 
              onChange={e => setNewFunc(e.target.value)}
              placeholder={`${t('common.eg')} x^3 - 2x`}
              onKeyDown={e => e.key === "Enter" && addFunction()}
              className="font-mono text-sm shadow-sm"
            />
            <Button onClick={addFunction} size="icon" className="shrink-0 h-10 w-10 shadow-sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Function list */}
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
            {functions.map((fn) => (
              <div 
                key={fn.id} 
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${fn.visible ? 'bg-background shadow-sm border-border/80' : 'bg-transparent border-dashed border-border/40 opacity-50'}`}
              >
                {/* Color dot */}
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fn.color }} />
                <span className="font-mono text-xs text-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  y = {fn.expr}
                </span>
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="icon" onClick={() => toggleFunction(fn.id)} className="h-6 w-6">
                    {fn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeFunction(fn.id)} className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            
            {functions.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground/50">
                <LineChart className="w-6 h-6" />
                <p className="text-xs text-center">{t('graphen.empty')}</p>
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="pt-3 border-t border-border/40 pb-2">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{t('editor.commonScenarios')}</h4>
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs font-mono justify-start bg-background/50 hover:bg-background shadow-sm border-border/50" onClick={() => addPreset("x^3 - 2x + 1")}>x³−2x+1</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-mono justify-start bg-background/50 hover:bg-background shadow-sm border-border/50" onClick={() => addPreset("2^x")}>2^x</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-mono justify-start bg-background/50 hover:bg-background shadow-sm border-border/50" onClick={() => addPreset("1/x")}>1/x</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-mono justify-start bg-background/50 hover:bg-background shadow-sm border-border/50" onClick={() => addPreset("sqrt(x)")}>√x</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-mono justify-start bg-background/50 hover:bg-background shadow-sm border-border/50" onClick={() => addPreset("abs(x)")}>|x|</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-mono justify-start bg-background/50 hover:bg-background shadow-sm border-border/50" onClick={() => addPreset("log(x)")}>log(x)</Button>
            </div>
          </div>
        </div>

        {/* Graph canvas */}
        <Card className="flex-1 overflow-hidden flex flex-col justify-center items-center bg-card border border-border shadow-inner relative">
          {graphError && (
            <div className="absolute top-3 left-3 right-3 z-10 bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2 rounded-lg">
              {graphError}
            </div>
          )}
          <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>
        </Card>
      </div>
    </div>
  );
}
