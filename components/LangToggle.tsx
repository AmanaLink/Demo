"use client";

import { ui } from "@/lib/copy";
import { LANGS } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { cx } from "./ui";

export function LangToggle() {
  const { lang, setLang, tr } = useLang();

  return (
    <div
      role="group"
      aria-label={tr(ui.language)}
      className="flex items-center rounded-xl border border-line bg-surface p-0.5"
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(code)}
            className={cx(
              "rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active ? "bg-accent/10 text-accent" : "text-muted hover:text-ink",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
