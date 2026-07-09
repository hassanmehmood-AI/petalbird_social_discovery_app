import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type WidgetCardProps = {
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
  headerExtra?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export function WidgetCard({
  title,
  subtitle,
  moreHref,
  moreLabel = "Show more",
  headerExtra,
  className,
  bodyClassName,
  children,
}: WidgetCardProps) {
  return (
    <div
      className={cn(
        "bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(123,127,239,0.06)] flex flex-col",
        className
      )}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-sm font-bold font-heading text-on-surface">{title}</h3>
          {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {headerExtra}
          {moreHref && (
            <Link
              href={moreHref}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              {moreLabel}
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}
