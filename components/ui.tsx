import type { ReactNode } from "react";

export const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");

export const button = {
  base: "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40",
  primary: "bg-accent px-4 py-2 text-accent-ink hover:opacity-90",
  secondary: "border border-line bg-surface px-4 py-2 text-ink hover:bg-surface-2",
  ghost: "px-3 py-2 text-muted hover:text-ink",
  outline: "border border-accent/40 bg-accent/5 px-4 py-2 text-accent hover:bg-accent/10",
  dashed: "border border-dashed border-line px-3 py-2 text-muted hover:border-accent/40 hover:text-ink",
};

type Tone = "accent" | "muted" | "outline";

const toneClass: Record<Tone, string> = {
  accent: "border-accent/25 bg-accent/10 text-accent",
  muted: "border-line bg-surface-2 text-muted",
  outline: "border-line bg-transparent text-muted",
};

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  meta,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cx("rounded-2xl border border-line bg-surface", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
          {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
          {meta && <span className="text-[11px] text-muted">{meta}</span>}
          {action && <div className="ml-auto">{action}</div>}
        </header>
      )}
      <div className={cx("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {lede && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">{lede}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}

export function Meter({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label: string;
}) {
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
      aria-label={label}
      className="flex gap-1"
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cx(
            "h-1.5 flex-1 rounded-full transition-colors",
            index < value ? "bg-accent" : "bg-line",
          )}
        />
      ))}
    </div>
  );
}

export function IconTile({ children, tone = "muted" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={cx(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}

type IconProps = { className?: string };

const base = "h-4 w-4";

function Svg({ className = base, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </Svg>
);

export const ShieldIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3l7 3v6c0 4-3 7.2-7 9-4-1.8-7-5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

export const TruckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.7" />
    <circle cx="17" cy="18" r="1.7" />
  </Svg>
);

export const ChatIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 12a8 8 0 0 1-8 8H8l-4 2v-5.5A8 8 0 1 1 20 12z" />
  </Svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
);

export const SparkIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" />
    <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
  </Svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 4l9 16H3L12 4z" />
    <path d="M12 10v4" />
    <path d="M12 17.2v.1" />
  </Svg>
);

export const ArrowRightIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeftIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </Svg>
);

export const ResetIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 5v5h5" />
    <path d="M4.8 13a8 8 0 1 0 2-6.7L4 10" />
  </Svg>
);

export const SunIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const MoonIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
  </Svg>
);

export const SendIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 12l16-7-6 15-2.5-5.5L4 12z" />
  </Svg>
);

export const HashIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M9 4L7 20M17 4l-2 16M4 9h16M3 15h16" />
  </Svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </Svg>
);

export const StoreIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 9h16l-1 10H5L4 9z" />
    <path d="M8 9V7a4 4 0 0 1 8 0v2" />
  </Svg>
);
