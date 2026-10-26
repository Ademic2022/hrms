"use client";

import { useQuery } from "urql";

import { Badge, type BadgeTone } from "@/components/ui";
import { graphql } from "@/gql";
import { formatDate } from "@/lib/format";

const TrainingStatusDocument = graphql(`
  query TrainingStatus($id: ID!) {
    trainingStatus(employeeId: $id) { courseId course lastCompleted dueOn state }
  }
`);

const STATES: Record<string, { label: string; tone: BadgeTone }> = {
  overdue: { label: "Overdue", tone: "bad" }, due_soon: { label: "Due soon", tone: "warn" },
  not_due: { label: "Not due yet", tone: "neutral" }, done: { label: "Up to date", tone: "good" },
};

/** Required courses (Settings → Training) and when each is next due. Nothing when none apply. */
export function TrainingDue({ employeeId }: { employeeId: string }) {
  const [{ data }] = useQuery({ query: TrainingStatusDocument, variables: { id: employeeId } });
  const rows = data?.trainingStatus ?? [];
  if (!rows.length) return null;
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h3 className="mb-3 text-[15px] font-semibold text-ink">Required training</h3>
      <ul className="divide-y divide-line">
        {rows.map((r) => (
          <li key={r.courseId} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
            <span className="font-medium text-ink">{r.course}</span>
            <span className="flex items-center gap-3 text-muted">
              {r.lastCompleted && <span>Done {formatDate(r.lastCompleted)}</span>}
              {r.dueOn && <span>Due {formatDate(r.dueOn)}</span>}
              <Badge tone={STATES[r.state]?.tone ?? "neutral"} dot>{STATES[r.state]?.label ?? r.state}</Badge>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
