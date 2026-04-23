"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  LineChart, 
  Variable, 
  BookOpen, 
  BarChart, 
  Coins, 
  TrendingUp, 
  Dices, 
  FileText,
  PenTool,
  Globe
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/dictionaries";

const routes = [
  { href: "/", key: "rechner", icon: Calculator },
  { href: "/editor", key: "editor", icon: PenTool },
  { href: "/graphen", key: "graphen", icon: LineChart },
  { href: "/gleichungen", key: "gleichungen", icon: Variable },
  { href: "/formelsammlung", key: "formeln", icon: BookOpen },
  { href: "/statistik", key: "statistik", icon: BarChart },
  { href: "/finanzmathe", key: "finanzmathe", icon: Coins },
  { href: "/differentialrechnung", key: "differential", icon: TrendingUp },
  { href: "/kombinatorik", key: "wahrscheinlichkeit", icon: Dices },
  { href: "/cheatsheet", key: "cheatsheet", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          SolveLab
        </h1>
        <p className="text-xs text-muted-foreground/80 mt-1.5 font-medium">{t('sidebar.subtitle')}</p>
        <p className="text-[10px] text-muted-foreground/50 mt-3 leading-tight border-l-2 border-primary/20 pl-2">
          {t('sidebar.slogan')}
        </p>
      </div>
      <div className="flex-1 py-2 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {t(`sidebar.${route.key}`)}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>Lang:</span>
        </div>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value as Language)}
          className="bg-input border border-border rounded px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="de">DE</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
          <option value="it">IT</option>
        </select>
      </div>
    </div>
  );
}
