import { ui } from "./copy";

export const TABS = [
  { id: "overview", label: ui.nav.overview },
  { id: "deal-flow", label: ui.nav.dealFlow },
  { id: "disputes", label: ui.nav.disputes },
  { id: "delivery", label: ui.nav.delivery },
  { id: "trust", label: ui.nav.trust },
  { id: "roadmap", label: ui.nav.roadmap },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export const isTabId = (value: string): value is TabId =>
  TABS.some((tab) => tab.id === value);
