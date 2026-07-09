import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  success: "bg-success-green/10 text-success-green",
  neutral: "bg-muted text-on-surface-variant",
  warning: "bg-amber-500/10 text-amber-600",
  primary: "bg-primary/10 text-primary",
  error: "bg-error-red/10 text-error-red",
} as const;

type Tone = keyof typeof TONE_CLASSES;

export function StatusBadge({
  label,
  tone,
  className,
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0",
        TONE_CLASSES[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
