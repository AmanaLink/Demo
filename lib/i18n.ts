export type Lang = "en" | "sw";

export interface Localized {
  readonly en: string;
  readonly sw: string;
}

/** Small helper so copy stays readable at the call site: L("English", "Kiswahili"). */
export const L = (en: string, sw: string): Localized => ({ en, sw });

export const pick = (lang: Lang, value: Localized): string => value[lang];

export const LANGS: readonly Lang[] = ["en", "sw"];

export const isLang = (value: unknown): value is Lang => value === "en" || value === "sw";

export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  sw: "Kiswahili",
};
