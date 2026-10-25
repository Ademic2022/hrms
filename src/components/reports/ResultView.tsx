"use client";

import { Card, Empty, Stat, Table, TD, TH } from "@/components/ui";
import { formatDate } from "@/lib/format";

type Cell = string | number | null;

export type ReportData = {
  chart: string; note: string; rows: unknown;
  columns: { key: string; label: string; kind: string }[];
  summary: { label: string; value: string }[];
};

export function show(value: Cell, kind: string) {
  if (value === null || value === "") return "—";
  if (kind === "date") return formatDate(String(value));
  if (kind === "percent") return `${value}%`;
  if (kind === "money") return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (kind === "number") return Number(value).toLocaleString();
  return String(value);
}

const NUMERIC = ["number", "percent", "money"];

/** A report's headline figures, its table (with a bar in the charted column) and its note. */
export function ResultView({ result, fetching, empty = "No one matches these filters in this period." }: { result: ReportData; fetching?: boolean; empty?: string }) {
  const chartIndex = result.columns.findIndex((c) => c.key === result.chart);
  const rows = (result.rows ?? []) as Cell[][];
  const max = chartIndex >= 0 ? Math.max(1, ...rows.map((r) => Number(r[chartIndex]) || 0)) : 1;
  return (
    <div className={fetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {result.summary.length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {result.summary.slice(0, 4).map((f) => <Stat key={f.label} label={f.label} value={f.value} />)}
        </div>
      )}
      {result.summary.length > 4 && (
        <p className="-mt-2 mb-5 text-sm text-muted">{result.summary.slice(4).map((f) => `${f.label}: ${f.value}`).join(" · ")}</p>
      )}
      <Card flush>
        {rows.length ? (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>{result.columns.map((c) => <TH key={c.key} align={NUMERIC.includes(c.kind) ? "right" : "left"}>{c.label}</TH>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((value, j) => {
                      const column = result.columns[j];
                      const numeric = NUMERIC.includes(column.kind);
                      return (
                        <TD key={j} align={numeric ? "right" : "left"} className={numeric ? "tabular-nums" : j === 0 ? "font-medium" : undefined}>
                          {j === chartIndex ? (
                            <span className="flex items-center justify-end gap-3">
                              <span className="hidden h-2 w-32 overflow-hidden rounded-full bg-subtle sm:block">
                                <span className="block h-full rounded-full bg-brand" style={{ width: `${(Number(value) / max) * 100}%` }} />
                              </span>
                              {show(value, column.kind)}
                            </span>
                          ) : show(value, column.kind)}
                        </TD>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="p-5"><Empty title="Nothing to show">{empty}</Empty></div>
        )}
      </Card>
      {result.note && <p className="mt-3 text-xs text-muted">{result.note}</p>}
    </div>
  );
}
