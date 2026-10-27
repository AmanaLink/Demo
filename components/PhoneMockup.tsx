"use client";

import { useEffect, useRef } from "react";
import { actorLabel, ui } from "@/lib/copy";
import { ORDER, type ChatMessage } from "@/lib/mock-deal";
import { useLang } from "./LangProvider";
import { CheckIcon, SendIcon, ShieldIcon, cx } from "./ui";

function Bubble({ message }: { message: ChatMessage }) {
  const { tr } = useLang();

  if (message.from === "system") {
    return (
      <p className="mx-auto max-w-[88%] rounded-full border border-line bg-surface/80 px-3 py-1.5 text-center text-[11px] leading-snug text-muted">
        {tr(message.text)}
      </p>
    );
  }

  if (message.verified) {
    return (
      <div className="max-w-[94%] rounded-2xl rounded-bl-md border border-accent/30 bg-accent/5 p-3">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
          <ShieldIcon className="h-3.5 w-3.5" />
          {tr(ui.phone.partnerCallback)}
        </p>
        <p className="text-[13px] leading-snug">{tr(message.text)}</p>
      </div>
    );
  }

  const isBuyer = message.from === "buyer";
  const sender =
    message.from === "courier"
      ? actorLabel.courier
      : message.from === "reviewer"
        ? actorLabel.reviewer
        : null;

  return (
    <div
      className={cx(
        "max-w-[86%] rounded-2xl px-3 py-2 text-[13px] leading-snug",
        isBuyer
          ? "ml-auto rounded-br-md bg-accent text-accent-ink"
          : "rounded-bl-md border border-line bg-surface",
      )}
    >
      {sender && (
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
          {tr(sender)}
        </p>
      )}
      {tr(message.text)}
    </div>
  );
}

export function PhoneMockup({ messages }: { messages: readonly ChatMessage[] }) {
  const { tr } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length]);

  return (
    <div className="mx-auto w-full max-w-[390px]">
      <div className="rounded-[2.3rem] border border-line bg-surface-2 p-1.5 shadow-sm">
        <div className="overflow-hidden rounded-[1.9rem] border border-line bg-surface">
          <div className="flex items-center gap-2.5 border-b border-line bg-surface px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent">
              ZT
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight">{ORDER.vendor}</p>
              <p className="flex items-center gap-1 text-[10px] text-muted">
                <CheckIcon className="h-3 w-3 text-accent" />
                {tr(ui.phone.verifiedBusiness)}
              </p>
            </div>
            <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted">
              <ShieldIcon className="h-3.5 w-3.5" />
            </span>
          </div>

          <div
            ref={scrollRef}
            className="h-[420px] space-y-2.5 overflow-y-auto bg-chat px-3 py-3 sm:h-[460px]"
          >
            <p className="mx-auto w-fit rounded-md bg-surface/70 px-2 py-0.5 text-[10px] text-muted">
              {tr(ui.phone.today)}
            </p>
            {messages.map((message) => (
              <div key={message.id} className="animate-bubble">
                <Bubble message={message} />
              </div>
            ))}
          </div>

          <div className="border-t border-line bg-surface px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5">
              <p className="flex-1 truncate text-[11px] text-muted">{tr(ui.phone.placeholder)}</p>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                <SendIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-center text-[10px] leading-snug text-muted">
              {tr(ui.phone.secureBanner)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
