"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/admin/WidgetCard";

type Bucket = {
  label: string;
  bucketStart: string;
  posts: number;
  ratings: number;
  signups: number;
  total: number;
};

type ActivityData = {
  range: "today" | "week" | "month";
  buckets: Bucket[];
  peakIndex: number;
  totalForRange: number;
};

const RANGES: { key: ActivityData["range"]; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

const SERIES = [
  { key: "signups" as const, label: "Signups", color: "#c64f00" },
  { key: "ratings" as const, label: "Ratings", color: "#0d9488" },
  { key: "posts" as const, label: "Posts", color: "#7B7FEF" },
];

const CHART_HEIGHT = 200;

function roundNiceValue(n: number) {
  if (n <= 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(n)));
  return Math.ceil(n / magnitude) * magnitude;
}

export function ActivityChart() {
  const [range, setRange] = useState<ActivityData["range"]>("today");
  const [data, setData] = useState<ActivityData | null>(null);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/activity?range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok) {
          setData(json.data);
          setFailed(false);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const buckets = data?.buckets ?? [];
  const maxTotal = Math.max(1, ...buckets.map((b) => b.total));
  const niceMax = roundNiceValue(maxTotal);
  const displayIndex = activeIndex ?? data?.peakIndex ?? null;

  const desktopStep = Math.max(1, Math.ceil(buckets.length / 6));
  const desktopVisible = new Set(buckets.map((_, i) => i).filter((i) => i % desktopStep === 0));
  const desktopVisibleArr = Array.from(desktopVisible);
  const mobileVisible = new Set(desktopVisibleArr.filter((_, pos) => pos % 2 === 0));

  return (
    <WidgetCard
      title="Activity Overview"
      subtitle="Posts, ratings & signups over time"
      headerExtra={
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
            {data ? data.totalForRange.toLocaleString() : "—"} total
          </span>
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap",
                  range === r.key
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      }
      bodyClassName="p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[11px] text-on-surface-variant">{s.label}</span>
          </div>
        ))}
      </div>

      {failed ? (
        <div className="h-52 flex items-center justify-center text-sm text-on-surface-variant">
          Couldn&apos;t load activity data
        </div>
      ) : !data ? (
        <div className="h-52 flex items-center justify-center text-sm text-on-surface-variant">
          Loading…
        </div>
      ) : data.totalForRange === 0 ? (
        <div className="h-52 flex items-center justify-center text-sm text-on-surface-variant">
          No activity in this period
        </div>
      ) : (
        <div>
          <div className="flex gap-3">
            {/* Y-axis */}
            <div
              className="flex flex-col justify-between text-[10px] text-outline shrink-0 text-right w-8"
              style={{ height: CHART_HEIGHT }}
            >
              <span>{niceMax}</span>
              <span>{Math.round(niceMax / 2)}</span>
              <span>0</span>
            </div>

            {/* Plot area */}
            <div className="relative flex-1 min-w-0">
              {/* Gridlines */}
              <div
                className="absolute inset-x-0 top-0 flex flex-col justify-between pointer-events-none"
                style={{ height: CHART_HEIGHT }}
              >
                <div className="border-t border-outline-variant/30" />
                <div className="border-t border-outline-variant/30" />
                <div className="border-t border-outline-variant/30" />
              </div>

              {/* Bars */}
              <div className="flex items-end gap-1" style={{ height: CHART_HEIGHT }}>
                {buckets.map((b, i) => {
                  const barTotalHeight =
                    b.total > 0 ? Math.max((b.total / niceMax) * CHART_HEIGHT, 4) : 2;
                  const isPeak = i === data.peakIndex;
                  const showTooltip = displayIndex === i;

                  const segments = SERIES.map((s) => ({
                    ...s,
                    value: b[s.key],
                    height: b.total > 0 ? (b[s.key] / b.total) * barTotalHeight : 0,
                  }));
                  const firstNonZero = segments.findIndex((s) => s.value > 0);

                  return (
                    <div
                      key={b.bucketStart}
                      className="relative flex-1 min-w-0 max-w-[28px] mx-auto flex flex-col items-center justify-end"
                      style={{ height: CHART_HEIGHT }}
                      tabIndex={0}
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                      onFocus={() => setActiveIndex(i)}
                      onBlur={() => setActiveIndex(null)}
                    >
                      {showTooltip && (
                        <div
                          className={cn(
                            "absolute bottom-full mb-1.5 z-10 rounded-lg bg-on-surface text-white text-[10px] px-2.5 py-2 shadow-lg whitespace-nowrap",
                            isPeak && activeIndex === null ? "" : ""
                          )}
                        >
                          <p className="font-bold mb-1">{b.label}</p>
                          {SERIES.map((s) => (
                            <p key={s.key} className="flex items-center gap-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: s.color }}
                              />
                              <span className="font-semibold">{b[s.key]}</span>
                              <span className="opacity-70">{s.label}</span>
                            </p>
                          ))}
                        </div>
                      )}
                      <div
                        className={cn(
                          "w-full flex flex-col gap-[2px] transition-opacity",
                          isPeak ? "opacity-100" : "opacity-80 hover:opacity-100"
                        )}
                        style={{ height: barTotalHeight }}
                      >
                        {segments.map((s, si) => (
                          <div
                            key={s.key}
                            className={cn(si === firstNonZero && "rounded-t-[3px]")}
                            style={{
                              height: s.height,
                              backgroundColor: s.value > 0 ? s.color : undefined,
                            }}
                          />
                        ))}
                        {b.total === 0 && (
                          <div className="w-full h-full bg-outline-variant/40 rounded-t-[3px]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1 mt-2 pl-[calc(2rem+0.75rem)]">
            {buckets.map((b, i) => (
              <div key={b.bucketStart} className="flex-1 min-w-0 max-w-[28px] mx-auto text-center">
                <span
                  className={cn(
                    "text-[9px] text-outline whitespace-nowrap",
                    mobileVisible.has(i) ? "block" : "hidden",
                    desktopVisible.has(i) ? "lg:block" : "lg:hidden"
                  )}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
