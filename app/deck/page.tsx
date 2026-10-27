import type { Metadata } from "next";
import { Deck } from "@/components/Deck";

export const metadata: Metadata = {
  title: "AmanaLink — prototype brief (PDF)",
  description:
    "Printable brief for the AmanaLink escrow and delivery prototype. Mock data only.",
};

export default function DeckPage() {
  return <Deck />;
}
