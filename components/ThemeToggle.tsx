"use client";

import { useSyncExternalStore } from "react";
import { ui } from "@/lib/copy";
import { readTheme, serverTheme, subscribePreferences, writeTheme } from "@/lib/preferences";
import { useLang } from "./LangProvider";
import { MoonIcon, SunIcon, cx } from "./ui";

export function ThemeToggle() {
  const { tr } = useLang();
  const theme = useSyncExternalStore(subscribePreferences, readTheme, serverTheme);
  const dark = theme === "dark";
  const label = tr(dark ? ui.themeLight : ui.themeDark);

  return (
    <button
      type="button"
      onClick={() => writeTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <SunIcon className={cx("h-4 w-4", !dark && "hidden")} />
      <MoonIcon className={cx("h-4 w-4", dark && "hidden")} />
    </button>
  );
}
