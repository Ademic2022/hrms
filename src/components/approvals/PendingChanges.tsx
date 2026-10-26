"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "urql";

import { Badge, Button, Card, ErrorNote, Input } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const PendingChangesDocument = graphql(`
  query PendingPayJobChanges {
    pendingChanges { id kind kindName employeeId employeeName summary status step stepCount requestedBy createdAt canDecide canCancel }
  }
`);

const DecideDocument = graphql(`
  mutation DecidePendingChange($id: ID!, $approve: Boolean!, $note: String) {
    decidePendingChange(id: $id, approve: $approve, note: $note) { change { id status } errors { message } }
  }
`);

const CancelDocument = graphql(`
  mutation CancelPendingChange($id: ID!) {
    cancelPendingChange(id: $id) { change { id status } errors { message } }
  }
`);

/** Pay and job changes waiting for approval (Settings → Approvals): yours to decide, and the ones you asked for. */
export function PendingChanges() {
  const [{ data, error }, reload] = useQuery({ query: PendingChangesDocument, requestPolicy: "cache-and-network" });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [problem, setProblem] = useState<string>();
  const [, decide] = useMutation(DecideDocument);
  const [, cancel] = useMutation(CancelDocument);
  if (error) return <ErrorNote error={errorMessage(error)} />;
  const changes = data?.pendingChanges ?? [];
  if (!changes.length) return null;
  const run = async (p: Promise<{ error?: unknown; data?: Record<string, { errors: { message: string }[] } | null> }>) => {
    const r = await p;
    const message = errorMessage(r.error as never) ?? Object.values(r.data ?? {})[0]?.errors[0]?.message;
    setProblem(message);
    reload({ requestPolicy: "network-only" });
  };

  return (
    <Card flush title="Pay and job changes" description="Changes that wait for approval before they take effect.">
      {problem && <div className="px-5 pt-3"><ErrorNote error={problem} /></div>}
      <ul className="divide-y divide-line">
        {changes.map((c) => (
          <li key={c.id} className="space-y-2 px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  <Link href={`/employees/${c.employeeId}`} className="hover:underline">{c.employeeName}</Link>
                  <Badge>{c.kindName}</Badge>
                </p>
                <p className="text-sm text-ink">{c.summary}</p>
                <p className="text-xs text-muted">
                  Asked by {c.requestedBy ?? "someone"} on {formatDate(c.createdAt)} · step {Math.min(c.step + 1, c.stepCount)} of {c.stepCount}
                </p>
              </div>
              {!c.canDecide && <Badge tone="warn" dot>Waiting for others</Badge>}
            </div>
            {(c.canDecide || c.canCancel) && (
              <div className="flex flex-wrap items-center gap-2">
                {c.canDecide && (
                  <>
                    <Input className="max-w-sm" placeholder="Note (optional)" aria-label="Note" value={notes[c.id] ?? ""}
                      onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })} />
                    <Button size="sm" onClick={() => run(decide({ id: c.id, approve: true, note: notes[c.id] || null }))}>Approve</Button>
                    <Button size="sm" variant="secondary" onClick={() => run(decide({ id: c.id, approve: false, note: notes[c.id] || null }))}>Reject</Button>
                  </>
                )}
                {c.canCancel && <Button size="sm" variant="ghost" onClick={() => run(cancel({ id: c.id }))}>Cancel request</Button>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
