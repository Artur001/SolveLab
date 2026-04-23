"use client";

import { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import { safeEvaluate } from "@/lib/math/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Delete, History, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SCI_BUTTONS = [
  "sin", "cos", "tan", "deg",
  "asin", "acos", "atan", "rad",
  "√x", "x²", "x³", "^", 
  "log", "ln", "pi", "e", 
  "(", ")"
];

const BASIC_BUTTONS = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+"
];

export default function CalculatorPage() {
  const { t } = useLanguage();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [livePreview, setLivePreview] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [history, setHistory] = useState<{ expr: string; res: string; status: string }[]>([]);
  const [isRad, setIsRad] = useState(true);

  // Live evaluation effect
  useEffect(() => {
    if (!expression) {
      setLivePreview("");
      setStatusMsg("");
      return;
    }
    const res = safeEvaluate(expression, {}, t);
    if (res.status === "success") {
      setLivePreview(res.value);
      setStatusMsg("");
    } else {
      setLivePreview("");
      // Only show error message on live preview if it's not a generic invalid input (to avoid flickering "Invalid input" while typing)
      if (res.status !== "invalid") {
         setStatusMsg(res.message || "");
      } else {
         setStatusMsg("");
      }
    }
  }, [expression, t]);

  const handleInput = (val: string) => {
    if (val === "=") {
      calculate();
      return;
    }

    setExpression((prev) => {
      // If we just calculated something and user types a number, start fresh
      // But if user types an operator, continue from result
      const operators = ["+", "-", "*", "/", "^"];
      
      const lastChar = prev.slice(-1);
      
      // Prevent multiple dots in the current number segment
      if (val === ".") {
        const parts = prev.split(/[\+\-\*\/\(\)\^]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) return prev;
        // if it's empty add 0.
        if (!lastPart) return prev + "0.";
      }
      
      // Prevent consecutive operators (replace the last one instead)
      if (operators.includes(val)) {
        if (operators.includes(lastChar)) {
          return prev.slice(0, -1) + val;
        }
        // Don't allow starting with an operator except minus
        if (prev === "" && val !== "-") {
          return prev;
        }
      }

      // Handle special buttons
      if (val === "x²") return prev + "^2";
      if (val === "x³") return prev + "^3";
      if (val === "√x") return prev + "sqrt(";

      // Add parenthesis for functions automatically
      const funcs = ["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "log", "ln"];
      if (funcs.includes(val)) {
        // If there's already a number before, maybe add a * ?
        // For now just append the function
        return prev + val + "(";
      }

      return prev + val;
    });
  };

  const calculate = () => {
    if (!expression) return;
    const res = safeEvaluate(expression, {}, t);
    
    if (res.status === "success") {
      setResult(res.value);
      setHistory([{ expr: expression, res: res.value, status: "success" }, ...history].slice(0, 10));
      setExpression(res.value); // chain operations
      setStatusMsg("");
    } else {
      setResult("");
      setStatusMsg(res.message || t("common.error"));
      setHistory([{ expr: expression, res: res.message || "Error", status: "error" }, ...history].slice(0, 10));
    }
  };

  const clear = () => {
    setExpression("");
    setResult("");
    setLivePreview("");
    setStatusMsg("");
  };

  const backspace = () => {
    setExpression((prev) => {
      // Smart backspace: delete whole function blocks or tokens at once instead of character by character
      const tokens = [
        "sin(", "cos(", "tan(", 
        "asin(", "acos(", "atan(", 
        "sqrt(", "log(", "ln(", 
        "pi", "deg", "rad", "^2", "^3"
      ];
      
      for (const token of tokens) {
        if (prev.endsWith(token)) {
          return prev.slice(0, -token.length);
        }
      }
      
      return prev.slice(0, -1);
    });
  };

  return (
    <div className="h-full flex flex-col gap-6 pt-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('rechner.title')}</h1>
          <p className="text-muted-foreground">{t('rechner.desc')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-[calc(100%-80px)] mt-4">
        {/* Main Calculator */}
        <div className="flex-1 flex flex-col min-w-[320px] max-w-2xl">
          <div className="bg-background rounded-lg flex flex-col justify-end items-end p-4 border-b-2 border-primary/20 relative min-h-[140px] mb-6">
            
            {statusMsg && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 text-destructive text-xs bg-destructive/10 px-2 py-1 rounded">
                <AlertCircle className="w-3.5 h-3.5" />
                {statusMsg}
              </div>
            )}

            <div className="text-muted-foreground/60 text-base font-mono tracking-wider break-all text-right w-full mb-1">{expression || "0"}</div>
            
            {livePreview && !result && (
              <div className="text-xl font-mono text-muted-foreground/30 break-all text-right w-full">= {livePreview}</div>
            )}
            
            {result && (
              <div className="text-5xl font-bold tracking-tight text-primary break-all text-right w-full tabular-nums">
                = {result}
              </div>
            )}
            
            {!result && !livePreview && !expression && (
              <div className="text-5xl font-bold tracking-tight text-foreground/10 text-right w-full">0</div>
            )}
          </div>

          <div className="flex gap-2 items-center px-1 mb-4">
            <Button variant="ghost" size="sm" className="text-[11px] font-mono h-7 px-2.5 rounded-sm bg-muted/40" onClick={() => setIsRad(!isRad)}>
              {isRad ? "RAD" : "DEG"}
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={backspace} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Delete className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clear} className="h-8 px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive">
              AC
            </Button>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {/* Sci pad */}
            <div className="col-span-4 grid grid-cols-4 gap-2 pr-4 border-r border-border/40 hidden md:grid">
              {SCI_BUTTONS.map((btn) => (
                <Button
                  key={btn}
                  variant="ghost"
                  className="text-primary/80 hover:text-primary hover:bg-primary/10 text-xs h-10 rounded-md font-mono"
                  onClick={() => handleInput(btn)}
                >
                  {btn}
                </Button>
              ))}
            </div>

            {/* Basic pad */}
            <div className="col-span-4 grid grid-cols-4 gap-2 md:pl-2">
              {BASIC_BUTTONS.map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "=" ? "default" : ["/", "*", "-", "+"].includes(btn) ? "secondary" : "outline"}
                  className={`h-10 text-sm font-medium rounded-md ${btn === "=" ? "shadow-md bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted/10 border-border/50 hover:bg-muted/30"}`}
                  onClick={() => handleInput(btn)}
                >
                  {btn}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="w-72 hidden lg:flex flex-col border-l border-border/40 pl-6 h-full pb-4">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <History className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px] uppercase tracking-widest">{t('common.history')}</span>
            <span className="text-[10px] ml-auto opacity-50">{history.length}/10</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
            {history.length === 0 && (
              <div className="flex flex-col items-start gap-1 mt-8 opacity-40">
                <span className="text-[11px]">{t('common.noHistory')}</span>
              </div>
            )}
            {history.map((item, i) => (
              <div 
                key={i} 
                className={`flex flex-col gap-1 items-start p-3 rounded-lg cursor-pointer transition-all border ${
                  item.status === 'error' 
                    ? 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10' 
                    : 'bg-muted/10 border-transparent hover:bg-muted/30 hover:border-border/50'
                }`}
                onClick={() => setExpression(item.expr)}
                title={t('common.clickToRestore')}
              >
                <span className="text-[10px] font-mono text-muted-foreground break-all">{item.expr}</span>
                <span className={`font-mono font-medium text-xs break-all ${item.status === 'error' ? 'text-destructive/80' : 'text-primary/90'}`}>= {item.res}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
