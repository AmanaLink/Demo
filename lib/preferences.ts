"use client";

import { isLang, type Lang } from "./i18n";

export type Theme = "light" | "dark";

const LANG_KEY = "amana.lang";
const THEME_KEY = "amana.theme";

/**
 * Small external store for persisted preferences. Using useSyncExternalStore
 * keeps SSR markup stable and avoids setState-in-effect cascades.
 */
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribePreferences(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readLang(): Lang {
  try {
    const stored = window.localStorage.getItem(LANG_KEY);
    return isLang(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

export function writeLang(lang: Lang): void {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* storage can be unavailable; the UI still switches */
  }
  document.documentElement.lang = lang;
  notify();
}

export function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function writeTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage can be unavailable; the theme still applies */
  }
  notify();
}

export const serverLang = (): Lang => "en";
export const serverTheme = (): Theme => "light";
