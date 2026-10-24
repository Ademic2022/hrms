"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Table, TD, TH, cx } from "@/components/ui";

/*
 * Small single-series charts for the home page, drawn as SVG to the data-viz specs:
 * one series in categorical slot 1 (blue, validated against our light and dark surfaces),
 * hairline solid gridlines, columns <= 24px with a 4px rounded end, 2px lines, >= 8px
 * end-dots with a surface ring, a hover tooltip on every mark and a table view.
 */

export interface Point { label: string; value: number }

const SERIES = "var(--series-1)";

/** Width of an element, kept up to date. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Clean upper bound and ticks: 0, step, 2·step… */
function scale(max: number) {
  if (max <= 0) return { top: 4, ticks: [0, 2, 4] };
  const rough = max / 3;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = 0; t <= top + 1e-9; t += step) ticks.push(Number(t.toFixed(4)));
  return { top, ticks };
}

const compact = (n: number) => (n >= 1000 ? `${Number((n / 1000).toFixed(1))}K` : `${Number(n.toFixed(1))}`);

function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) {
  const left = Math.min(Math.max(x, 60), width - 60);
  return (
    <div role="status" className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-md"
      style={{ left, top: y - 8 }}>
      {children}
    </div>
  );
}

const H = 160;
const PAD = { top: 12, right: 12, bottom: 24, left: 32 };

function Frame({ width, ticks, top, labels, children }: { width: number; ticks: number[]; top: number; labels: string[]; children: ReactNode }) {
  const plotW = width - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const every = Math.ceil(labels.length / Math.max(1, Math.floor(plotW / 44)));
  return (
    <svg width={width} height={H} className="block overflow-visible" aria-hidden>
      {ticks.map((t) => {
        const y = PAD.top + plotH - (t / top) * plotH;
        return (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y} stroke={t === 0 ? "var(--axis)" : "var(--grid)"} strokeWidth={1} shapeRendering="crispEdges" />
            <text x={PAD.left - 8} y={y} dy="0.32em" textAnchor="end" className="fill-[var(--muted)] text-[11px] tabular-nums">{compact(t)}</text>
          </g>
        );
      })}
      {labels.map((l, i) => i % every === 0 || i === labels.length - 1 ? (
        <text key={l + i} x={PAD.left + (plotW / labels.length) * (i + 0.5)} y={H - 6} textAnchor="middle" className="fill-[var(--muted)] text-[11px]">{l}</text>
      ) : null)}
      {children}
    </svg>
  );
}

function ChartShell({ points, unit, chart, caption }: { points: Point[]; unit: string; chart: ReactNode; caption: string }) {
  const [table, setTable] = useState(false);
  return (
    <figure className="viz-root">
      {table ? (
        <div className="max-h-[180px] overflow-y-auto">
          <Table>
            <thead><tr><TH>Month</TH><TH align="right">{unit}</TH></tr></thead>
            <tbody>{points.map((p) => <tr key={p.label}><TD>{p.label}</TD><TD align="right" className="tabular-nums">{Number(p.value.toFixed(2))}</TD></tr>)}</tbody>
          </Table>
        </div>
      ) : chart}
      <figcaption className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{caption}</span>
        <button type="button" onClick={() => setTable(!table)} className="font-medium text-brand-ink hover:underline">{table ? "Show chart" : "Show table"}</button>
      </figcaption>
    </figure>
  );
}

/** Columns for counts per month (leavers, days taken). */
export function ColumnChart({ points, unit, caption }: { points: Point[]; unit: string; caption: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const { top, ticks } = scale(Math.max(...points.map((p) => p.value), 0));
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / Math.max(1, points.length);
  const barW = Math.min(24, band - 2);
  const chart = (
    <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}>
      {width > 0 && (
        <Frame width={width} ticks={ticks} top={top} labels={points.map((p) => p.label)}>
          {points.map((p, i) => {
            const h = (p.value / top) * plotH;
            const x = PAD.left + band * i + (band - barW) / 2;
            const y = PAD.top + plotH - h;
            const r = Math.min(4, h, barW / 2);
            return (
              <g key={p.label}>
                {h > 0 && (
                  <path d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z`}
                    fill={SERIES} opacity={hover === null || hover === i ? 1 : 0.55} />
                )}
                <rect x={PAD.left + band * i} y={PAD.top} width={band} height={plotH} fill="transparent"
                  onPointerEnter={() => setHover(i)} />
              </g>
            );
          })}
        </Frame>
      )}
      {hover !== null && width > 0 && (
        <Tooltip x={PAD.left + band * (hover + 0.5)} y={PAD.top + plotH - (points[hover].value / top) * plotH} width={width}>
          <span className="block font-semibold text-ink">{Number(points[hover].value.toFixed(2))} {unit}</span>
          <span className="text-muted">{points[hover].label}</span>
        </Tooltip>
      )}
    </div>
  );
  return <ChartShell points={points} unit={unit} chart={chart} caption={caption} />;
}

/** A line for a level over time (headcount), with the latest value labelled at its end. */
export function LineChart({ points, unit, caption }: { points: Point[]; unit: string; caption: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const { top, ticks } = scale(Math.max(...points.map((p) => p.value), 0));
  const plotW = Math.max(0, width - PAD.left - PAD.right - 24);
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / Math.max(1, points.length);
  const at = (i: number) => [PAD.left + band * (i + 0.5), PAD.top + plotH - (points[i].value / top) * plotH] as const;
  const path = points.map((_, i) => `${i ? "L" : "M"}${at(i)[0]},${at(i)[1]}`).join(" ");
  const last = points.length - 1;
  const chart = (
    <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}
      onPointerMove={(ev) => {
        const box = ev.currentTarget.getBoundingClientRect();
        const i = Math.round((ev.clientX - box.left - PAD.left) / band - 0.5);
        setHover(Math.max(0, Math.min(last, i)));
      }}>
      {width > 0 && points.length > 0 && (
        <Frame width={width - 24} ticks={ticks} top={top} labels={points.map((p) => p.label)}>
          <path d={`${path} L${at(last)[0]},${PAD.top + plotH} L${at(0)[0]},${PAD.top + plotH} Z`} fill={SERIES} opacity={0.1} />
          <path d={path} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {hover !== null && <line x1={at(hover)[0]} x2={at(hover)[0]} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--axis)" strokeWidth={1} />}
          {[hover ?? last].map((i) => (
            <circle key={i} cx={at(i)[0]} cy={at(i)[1]} r={4} fill={SERIES} stroke="var(--surface)" strokeWidth={2} />
          ))}
          <text x={at(last)[0] + 8} y={at(last)[1]} dy="0.32em" className="fill-[var(--ink)] text-[12px] font-semibold">{compact(points[last].value)}</text>
        </Frame>
      )}
      {hover !== null && width > 0 && (
        <Tooltip x={at(hover)[0]} y={at(hover)[1]} width={width}>
          <span className="block font-semibold text-ink">{Number(points[hover].value.toFixed(2))} {unit}</span>
          <span className="text-muted">{points[hover].label}</span>
        </Tooltip>
      )}
    </div>
  );
  return <ChartShell points={points} unit={unit} chart={chart} caption={caption} />;
}

/** Horizontal bars for a breakdown (people by location), labelled with their values. */
export function BarList({ items, unit }: { items: { label: string; value: number }[]; unit: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="viz-root space-y-3">
      {items.map((i) => (
        <li key={i.label} title={`${i.label}: ${i.value} ${unit}`}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate text-ink">{i.label}</span>
            <span className="tabular-nums text-muted">{i.value}</span>
          </div>
          <div className="h-2 rounded-full bg-subtle">
            <div className={cx("h-full rounded-full")} style={{ width: `${(i.value / max) * 100}%`, background: SERIES }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
