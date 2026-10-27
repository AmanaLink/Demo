"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { pick, type Lang, type Localized } from "@/lib/i18n";
import { readLang, serverLang, subscribePreferences, writeLang } from "@/lib/preferences";

interface LangContextValue {
  readonly lang: Lang;
  readonly tr: (value: Localized) => string;
  readonly setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribePreferences, readLang, serverLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);
  const tr = useCallback((value: Localized) => pick(lang, value), [lang]);

  const value = useMemo<LangContextValue>(() => ({ lang, tr, setLang }), [lang, tr, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used inside <LangProvider>");
  return context;
}
