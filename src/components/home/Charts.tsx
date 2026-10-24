"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Table, TD, TH } from "@/components/ui";

/*
 * Small charts for the home page, drawn as SVG to the data-viz specs: categorical slots in
 * fixed order (--series-1/2/3, validated against our light and dark surfaces), hairline solid
 * gridlines, columns <= 24px with a 4px rounded end and a 2px surface gap between stacked
 * segments, 2px lines, >= 8px end-dots with a surface ring, a tooltip on every mark, a legend
 * for two or more series, and a table view for every chart.
 */

export interface Series { key: string; label: string; color: string }
export interface Column { month: string; label: string; year: number; values: Record<string, number> }

export const SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];

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

/** A clean top value and its ticks. */
function scale(max: number) {
  if (max <= 0) return { top: 4, ticks: [0, 2, 4] };
  const rough = max / 3;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= top + 1e-9; t += step) ticks.push(Number(t.toFixed(4)));
  return { top, ticks };
}

export const compact = (n: number) => (Math.abs(n) >= 1000 ? `${Number((n / 1000).toFixed(1))}K` : `${Number(n.toFixed(1))}`);

/** Rounded-top column (square at the baseline). */
function columnPath(x: number, y: number, w: number, h: number, rounded = true) {
  if (h <= 0) return "";
  const r = rounded ? Math.min(4, h, w / 2) : 0;
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

/** Column hanging below a baseline, rounded at its bottom end. */
function downPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, h, w / 2);
  return `M${x},${y} V${y + h - r} Q${x},${y + h} ${x + r},${y + h} H${x + w - r} Q${x + w},${y + h} ${x + w},${y + h - r} V${y} Z`;
}

function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) {
  return (
    <div role="status" className="pointer-events-none absolute z-10 min-w-[140px] -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-md"
      // Never above the chart: the widget clips anything outside it.
      style={{ left: Math.min(Math.max(x, 80), width - 80), top: Math.max(y - 10, 84) }}>
      {children}
    </div>
  );
}

/** A tooltip row: a short line key in the series colour, the value strong, the name after. */
export function TipRow({ color, value, label }: { color?: string; value: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      {color && <span className="h-0.5 w-3 rounded-full" style={{ background: color }} />}
      <strong className="font-semibold text-ink">{value}</strong>
      <span className="text-muted">{label}</span>
    </span>
  );
}

export function Legend({ series }: { series: Series[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color }} />{s.label}</li>
      ))}
    </ul>
  );
}

/** Table twin of a chart, for reading values without hovering. */
export function ChartTable({ columns, series, format = (n) => String(n) }: { columns: Column[]; series: Series[]; format?: (n: number) => string }) {
  return (
    <div className="max-h-[220px] overflow-y-auto rounded-lg border border-line">
      <Table>
        <thead><tr><TH>Month</TH>{series.map((s) => <TH key={s.key} align="right">{s.label}</TH>)}</tr></thead>
        <tbody>
          {columns.map((c) => (
            <tr key={c.month}><TD>{c.label} {c.year}</TD>{series.map((s) => <TD key={s.key} align="right" className="tabular-nums">{format(c.values[s.key] ?? 0)}</TD>)}</tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

const PAD = { top: 26, right: 8, bottom: 22, left: 8 };

/** Year labels over the first month and over each January, with a hairline before January. */
function YearMarks({ columns, band, height }: { columns: Column[]; band: number; height: number }) {
  return (
    <>
      {columns.map((c, i) => (i === 0 || c.label.toUpperCase() === "JAN") && (
        <g key={c.month}>
          {i > 0 && <line x1={PAD.left + band * i} x2={PAD.left + band * i} y1={4} y2={height - 4} stroke="var(--axis)" strokeWidth={1} shapeRendering="crispEdges" />}
          <text x={PAD.left + band * i + 6} y={14} className="fill-[var(--ink)] text-[12px]">{c.year}</text>
        </g>
      ))}
    </>
  );
}

/**
 * Monthly columns, single or stacked. `labelOf` puts a value over each column (selective: the
 * one number per month the chart is about). `tip` renders the hover readout for a month.
 */
export function MonthColumns({ columns, series, height = 220, labelOf, tip, stacked }: {
  columns: Column[]; series: Series[]; height?: number; stacked?: boolean;
  labelOf?: (c: Column) => string | null; tip: (c: Column) => ReactNode;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const totals = columns.map((c) => series.reduce((sum, s) => sum + (c.values[s.key] ?? 0), 0));
  const { top } = scale(Math.max(...(stacked ? totals : columns.map((c) => c.values[series[0].key] ?? 0)), 0));
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const band = plotW / Math.max(1, columns.length);
  const barW = Math.min(24, Math.max(4, band - 10));
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;

  return (
    <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={height} className="block" role="img" aria-label="Chart; values are in the table view">
          <YearMarks columns={columns} band={band} height={height - PAD.bottom} />
          <line x1={PAD.left} x2={width - PAD.right} y1={PAD.top + plotH} y2={PAD.top + plotH} stroke="var(--axis)" strokeWidth={1} shapeRendering="crispEdges" />
          {columns.map((c, i) => {
            const x = PAD.left + band * i + (band - barW) / 2;
            let base = 0;
            const keys = stacked ? series : [series[0]];
            const visible = keys.filter((s) => (c.values[s.key] ?? 0) > 0);
            const label = labelOf?.(c);
            return (
              <g key={c.month} opacity={hover === null || hover === i ? 1 : 0.6}>
                {keys.map((s) => {
                  const v = c.values[s.key] ?? 0;
                  if (v <= 0) return null;
                  const isTop = s.key === visible[visible.length - 1]?.key;
                  const y0 = y(base + v);
                  // 2px surface gap between stacked segments.
                  const h = y(base) - y0 - (base > 0 ? 2 : 0);
                  base += v;
                  return <path key={s.key} d={columnPath(x, y0, barW, h, isTop)} fill={s.color} />;
                })}
                {label && <text x={x + barW / 2} y={y(stacked ? totals[i] : c.values[series[0].key] ?? 0) - 6} textAnchor="middle" className="fill-[var(--muted)] text-[11px] tabular-nums">{label}</text>}
                <text x={PAD.left + band * (i + 0.5)} y={height - 6} textAnchor="middle" className="fill-[var(--muted)] text-[11px] uppercase">{c.label}</text>
                <rect x={PAD.left + band * i} y={0} width={band} height={height} fill="transparent" onPointerEnter={() => setHover(i)}
                  tabIndex={0} onFocus={() => setHover(i)} onBlur={() => setHover(null)} aria-label={`${c.label} ${c.year}`} />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tooltip x={PAD.left + band * (hover + 0.5)} y={y(stacked ? totals[hover] : columns[hover].values[series[0].key] ?? 0)} width={width}>
          <span className="mb-1 block font-medium text-ink">{columns[hover].label} {columns[hover].year}</span>
          {tip(columns[hover])}
        </Tooltip>
      )}
    </div>
  );
}

/** Additions above a centre line, terminations below it, month by month (diverging). */
export function DivergingStrip({ columns, up, down, height = 76 }: { columns: Column[]; up: Series; down: Series; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...columns.map((c) => Math.max(c.values[up.key] ?? 0, c.values[down.key] ?? 0)));
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const band = plotW / Math.max(1, columns.length);
  const barW = Math.min(24, Math.max(4, band - 10));
  const mid = height / 2;
  const half = mid - 6;
  return (
    <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={height} className="block" role="img" aria-label="Additions and terminations; values are in the table view">
          <line x1={PAD.left} x2={width - PAD.right} y1={mid} y2={mid} stroke="var(--axis)" strokeWidth={1} shapeRendering="crispEdges" />
          {columns.map((c, i) => {
            const x = PAD.left + band * i + (band - barW) / 2;
            const a = ((c.values[up.key] ?? 0) / max) * half;
            const t = ((c.values[down.key] ?? 0) / max) * half;
            return (
              <g key={c.month} opacity={hover === null || hover === i ? 1 : 0.6}>
                {a > 0 && <path d={columnPath(x, mid - 1 - a, barW, a)} fill={up.color} />}
                {t > 0 && <path d={downPath(x, mid + 1, barW, t)} fill={down.color} />}
                <rect x={PAD.left + band * i} y={0} width={band} height={height} fill="transparent" onPointerEnter={() => setHover(i)} />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tooltip x={PAD.left + band * (hover + 0.5)} y={8} width={width}>
          <span className="mb-1 block font-medium text-ink">{columns[hover].label} {columns[hover].year}</span>
          <TipRow color={up.color} value={columns[hover].values[up.key] ?? 0} label={up.label.toLowerCase()} />
          <TipRow color={down.color} value={columns[hover].values[down.key] ?? 0} label={down.label.toLowerCase()} />
        </Tooltip>
      )}
    </div>
  );
}

/** A line over the months with a start dot and an end ring, the latest value labelled. */
export function MonthLine({ columns, series, unit, height = 150 }: { columns: Column[]; series: Series; unit: string; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const values = columns.map((c) => c.values[series.key] ?? 0);
  const { top } = scale(Math.max(...values, 0));
  const pad = { top: 14, right: 34, bottom: 22, left: 10 };
  const plotW = Math.max(0, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const step = plotW / Math.max(1, columns.length - 1);
  const at = (i: number) => [pad.left + step * i, pad.top + plotH - (values[i] / top) * plotH] as const;
  const last = columns.length - 1;
  const path = values.map((_, i) => `${i ? "L" : "M"}${at(i)[0]},${at(i)[1]}`).join(" ");
  return (
    <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}
      onPointerMove={(ev) => {
        const box = ev.currentTarget.getBoundingClientRect();
        setHover(Math.max(0, Math.min(last, Math.round((ev.clientX - box.left - pad.left) / step))));
      }}>
      {width > 0 && columns.length > 0 && (
        <svg width={width} height={height} className="block" role="img" aria-label="Chart; values are in the table view">
          <line x1={pad.left} x2={width - pad.right} y1={pad.top + plotH} y2={pad.top + plotH} stroke="var(--grid)" strokeWidth={1} shapeRendering="crispEdges" />
          <path d={path} fill="none" stroke={series.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {hover !== null && <line x1={at(hover)[0]} x2={at(hover)[0]} y1={pad.top} y2={pad.top + plotH} stroke="var(--axis)" strokeWidth={1} />}
          <circle cx={at(0)[0]} cy={at(0)[1]} r={4} fill={series.color} stroke="var(--surface)" strokeWidth={2} />
          <circle cx={at(hover ?? last)[0]} cy={at(hover ?? last)[1]} r={5} fill="var(--surface)" stroke={series.color} strokeWidth={2.5} />
          <text x={at(last)[0] + 9} y={at(last)[1]} dy="0.32em" className="fill-[var(--ink)] text-[12px] font-semibold">{compact(values[last])}</text>
          {[0, Math.floor(last / 2), last].map((i) => (
            <text key={i} x={at(i)[0]} y={height - 6} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} className="fill-[var(--muted)] text-[11px] uppercase">
              {columns[i].label}
            </text>
          ))}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tooltip x={at(hover)[0]} y={at(hover)[1]} width={width}>
          <span className="mb-1 block font-medium text-ink">{columns[hover].label} {columns[hover].year}</span>
          <TipRow color={series.color} value={Number(values[hover].toFixed(1))} label={unit} />
        </Tooltip>
      )}
    </div>
  );
}

/** Horizontal bars for a breakdown, each labelled with its count and share. */
export function BarList({ items, total, max = 8 }: { items: { label: string; value: number }[]; total?: number; max?: number }) {
  const [all, setAll] = useState(false);
  const top = Math.max(...items.map((i) => i.value), 1);
  const sum = total ?? items.reduce((s, i) => s + i.value, 0);
  const shown = all ? items : items.slice(0, max);
  return (
    <div>
      <ul className="space-y-3">
        {shown.map((i) => (
          <li key={i.label} title={`${i.label}: ${i.value}`}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="truncate text-ink">{i.label}</span>
              <span className="flex-none tabular-nums text-muted">{i.value}{sum ? <span className="ml-1.5 text-xs">{Math.round((i.value / sum) * 100)}%</span> : null}</span>
            </div>
            <div className="h-2 rounded-full bg-subtle">
              <div className="h-full rounded-full" style={{ width: `${(i.value / top) * 100}%`, background: SERIES[0] }} />
            </div>
          </li>
        ))}
      </ul>
      {items.length > max && (
        <button type="button" onClick={() => setAll(!all)} className="mt-3 text-xs font-medium text-brand-ink hover:underline">
          {all ? "Show fewer" : `${items.length - max} more…`}
        </button>
      )}
    </div>
  );
}
