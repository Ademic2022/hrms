"use client";

import { useState } from "react";
import { useQuery } from "urql";

import { type BadgeTone, cx, Input } from "@/components/ui";
import { graphql } from "@/gql";

const PeopleSearchDocument = graphql(`
  query PerformancePeopleSearch($search: String) { directory(search: $search, first: 8) { nodes { id fullName jobTitle } } }
`);

/** Shared fields for goal and review lists; codegen picks these fragments up from here. */
export const GoalFields = graphql(`
  fragment GoalFields on Goal {
    id title description employeeId employeeName parentId parentTitle startDate dueDate progress status supporting canEdit updatedAt
    keyResults { id title startValue targetValue currentValue unit progress }
  }
`);

export const ReviewRowFields = graphql(`
  fragment ReviewRowFields on ReviewSummary {
    id cycleName cycleStatus employeeName department managerName status overallRating calibratedRating scale myRole myResponseId myResponseDone due
    selfDone managerDone
  }
`);

export const GOAL_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  on_track: { label: "On track", tone: "good" }, at_risk: { label: "At risk", tone: "warn" }, behind: { label: "Behind", tone: "bad" },
  done: { label: "Done", tone: "brand" }, cancelled: { label: "Cancelled", tone: "neutral" },
};

export const REVIEW_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  self_pending: { label: "Self review due", tone: "warn" }, manager_pending: { label: "Manager review due", tone: "warn" },
  no_reviewer: { label: "No reviewer", tone: "bad" }, ready_to_share: { label: "Ready to share", tone: "brand" },
  shared: { label: "Shared", tone: "good" }, acknowledged: { label: "Acknowledged", tone: "good" },
};

export const CYCLE_KINDS: Record<string, string> = {
  annual: "Annual", mid_year: "Mid-year", quarterly: "Quarterly", probation: "Probation", other: "Other",
};

export const ROLE_LABEL: Record<string, string> = { self: "Self review", manager: "Manager review", peer: "Peer review" };

export type Question = { id: string; kind: "rating" | "text"; label: string; for: string[] };
export type Answers = Record<string, { rating?: number | null; text?: string }>;

export function Progress({ value, tone = "brand" }: { value: number; tone?: "brand" | "good" | "warn" | "bad" }) {
  const colour = { brand: "bg-brand", good: "bg-emerald-500", warn: "bg-amber-500", bad: "bg-red-500" }[tone];
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-subtle"><div className={cx("h-full rounded-full", colour)} style={{ width: `${value}%` }} /></div>
      <span className="w-9 text-right text-xs tabular-nums text-muted">{value}%</span>
    </div>
  );
}

export const goalTone = (status: string) => ({ at_risk: "warn", behind: "bad", done: "good" } as const)[status as "at_risk"] ?? "brand";

/** A row of buttons, one per point on the scale; the label of the chosen point shows underneath. */
export function RatingPicker({ scale, value, onChange, disabled, label }: {
  scale: string[]; value?: number | null; onChange?: (v: number) => void; disabled?: boolean; label: string;
}) {
  return (
    <div>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {scale.map((s, i) => (
          <button key={s} type="button" role="radio" aria-checked={value === i + 1} title={s} disabled={disabled}
            onClick={() => onChange?.(i + 1)}
            className={cx("h-9 min-w-9 rounded-lg border px-3 text-sm font-medium tabular-nums transition-colors",
              value === i + 1 ? "border-brand bg-brand text-white" : "border-line-strong bg-surface text-ink hover:bg-subtle",
              disabled && "pointer-events-none opacity-70")}>
            {i + 1}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">{value ? scale[value - 1] : `1 = ${scale[0]}, ${scale.length} = ${scale[scale.length - 1]}`}</p>
    </div>
  );
}

export function ratingText(scale: string[], value?: number | null) {
  return value ? `${value} · ${scale[value - 1] ?? ""}` : "—";
}

/** Type a name, pick a person. `exclude` hides people already chosen. */
export function PersonSearch({ onPick, exclude = [], placeholder = "Search by name" }: {
  onPick: (p: { id: string; name: string }) => void; exclude?: string[]; placeholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [{ data }] = useQuery({ query: PeopleSearchDocument, variables: { search }, pause: search.trim().length < 2 });
  const hits = (data?.directory.nodes ?? []).filter((n) => !exclude.includes(n.id));
  return (
    <div className="relative">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {search.trim().length >= 2 && hits.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-surface py-1 shadow-lg">
          {hits.map((p) => (
            <li key={p.id}>
              <button type="button" className="flex w-full flex-col px-3 py-1.5 text-left hover:bg-subtle"
                onClick={() => { onPick({ id: p.id, name: p.fullName }); setSearch(""); }}>
                <span className="text-sm text-ink">{p.fullName}</span>
                {p.jobTitle && <span className="text-xs text-muted">{p.jobTitle}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
