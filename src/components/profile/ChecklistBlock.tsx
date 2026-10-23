"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "urql";

import { IconCheck, IconPlus, IconTrash } from "@/components/icons";
import { Badge, Button, Dialog, ErrorNote, Field, IconButton, Input, Select, cx } from "@/components/ui";
import { graphql } from "@/gql";
import type { ChecklistKind, EmployeeChecklistQuery, TaskAssignee } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { reportErrors, today } from "@/lib/forms";

import type { Profile } from "./query";
import { ProfileSection } from "./Section";

const ChecklistDocument = graphql(`
  query EmployeeChecklist($employeeId: ID!, $kind: ChecklistKind!) {
    checklist(employeeId: $employeeId, kind: $kind) {
      startDate
      tasks { id title description category assignee dueDate completedAt completedByName canComplete }
    }
  }
`);

const StartChecklistDocument = graphql(`
  mutation StartChecklist($employeeId: ID!, $kind: ChecklistKind!, $startDate: Date) {
    startChecklist(employeeId: $employeeId, kind: $kind, startDate: $startDate) { tasks { id } errors { field message } }
  }
`);

const SetTaskDoneDocument = graphql(`
  mutation SetTaskDone($id: ID!, $done: Boolean!) {
    setTaskDone(id: $id, done: $done) { task { id completedAt } errors { field message } }
  }
`);

const AddTaskDocument = graphql(`
  mutation AddEmployeeTask($input: AddTaskInput!) {
    addEmployeeTask(input: $input) { task { id } errors { field message } }
  }
`);

const DeleteTaskDocument = graphql(`
  mutation DeleteEmployeeTask($id: ID!) {
    deleteEmployeeTask(id: $id)
  }
`);

type Task = EmployeeChecklistQuery["checklist"]["tasks"][number];

export const ASSIGNEES: { value: TaskAssignee; label: string }[] = [
  { value: "HR", label: "HR" }, { value: "MANAGER", label: "Manager" }, { value: "EMPLOYEE", label: "Employee" },
  { value: "IT", label: "IT" }, { value: "FINANCE", label: "Finance" },
];

function AddTaskDialog({ employeeId, kind, onClose, onSaved }: { employeeId: string; kind: ChecklistKind; onClose: () => void; onSaved: () => void }) {
  const [, add] = useMutation(AddTaskDocument);
  const [v, setV] = useState({ title: "", category: "", assignee: "HR" as TaskAssignee, dueDate: today(), description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!v.title.trim()) return setErrors({ title: "Give the task a title." });
    setBusy(true);
    const result = await add({ input: { employeeId, kind, ...v, dueDate: v.dueDate || null } });
    setBusy(false);
    const found: Record<string, string> = {};
    const failed = reportErrors(result, result.data?.addEmployeeTask.errors, ["title", "category", "assignee", "dueDate", "description"] as const,
      (f, m) => { found[f] = m; }, setFormError);
    setErrors(found);
    if (!failed) onSaved();
  }

  return (
    <Dialog open onClose={onClose} title="Add task"
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="task-form" busy={busy}>Add task</Button>
      </>}>
      <form id="task-form" onSubmit={submit} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <Field label="Task" error={errors.title}><Input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category" optional><Input value={v.category} placeholder="Paperwork" onChange={(e) => setV({ ...v, category: e.target.value })} /></Field>
          <Field label="Assigned to">
            <Select value={v.assignee} onChange={(e) => setV({ ...v, assignee: e.target.value as TaskAssignee })}>
              {ASSIGNEES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </Select>
          </Field>
          <Field label="Due" optional error={errors.dueDate}><Input type="date" value={v.dueDate} onChange={(e) => setV({ ...v, dueDate: e.target.value })} /></Field>
        </div>
        <Field label="Details" optional><Input value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></Field>
      </form>
    </Dialog>
  );
}

/** An onboarding or offboarding checklist: tasks grouped by category, ticked off by whoever they are assigned to. */
export function ChecklistBlock({ e, kind, title, icon, canManage, onSaved }: {
  e: Profile; kind: ChecklistKind; title: string; icon: string; canManage: boolean; onSaved: (message: string) => void;
}) {
  const [{ data, error }, reload] = useQuery({ query: ChecklistDocument, variables: { employeeId: e.id, kind } });
  const [, start] = useMutation(StartChecklistDocument);
  const [, setDone] = useMutation(SetTaskDoneDocument);
  const [, remove] = useMutation(DeleteTaskDocument);
  const [adding, setAdding] = useState(false);
  const [problem, setProblem] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  if (error || !data) return null;
  const { tasks } = data.checklist;
  const refresh = () => reload({ requestPolicy: "network-only" });
  const done = tasks.filter((t) => t.completedAt).length;
  const anchor = startDate || data.checklist.startDate;
  const onboarding = kind === "ONBOARDING";

  async function begin() {
    setBusy(true);
    const result = await start({ employeeId: e.id, kind, startDate: anchor });
    setBusy(false);
    const message = errorMessage(result.error) ?? result.data?.startChecklist.errors[0]?.message;
    if (message) return setProblem(message);
    setProblem(undefined);
    refresh();
    onSaved(`${onboarding ? "Onboarding" : "Offboarding"} started.`);
  }

  async function toggle(task: Task) {
    const result = await setDone({ id: task.id, done: !task.completedAt });
    const message = errorMessage(result.error) ?? result.data?.setTaskDone.errors[0]?.message;
    if (message) setProblem(message);
    refresh();
  }

  if (!tasks.length) {
    return (
      <ProfileSection title={title} icon={icon}>
        {problem && <div className="mb-3"><ErrorNote error={problem} /></div>}
        <p className="text-sm text-muted">
          {onboarding ? "No onboarding checklist yet." : "No offboarding checklist yet."}
          {canManage && ` Start one from your ${onboarding ? "onboarding" : "offboarding"} tasks; due dates count from the ${onboarding ? "start date" : "last day"}.`}
        </p>
        {canManage && (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Field label={onboarding ? "Start date" : "Last day"}>
              <Input type="date" value={anchor} onChange={(ev) => setStartDate(ev.target.value)} />
            </Field>
            <Button busy={busy} onClick={begin}>Start {onboarding ? "onboarding" : "offboarding"}</Button>
          </div>
        )}
      </ProfileSection>
    );
  }

  const groups = new Map<string, Task[]>();
  for (const t of tasks) groups.set(t.category || "Other", [...(groups.get(t.category || "Other") ?? []), t]);
  const now = today();

  return (
    <ProfileSection title={title} icon={icon}
      description={`${done} of ${tasks.length} done · ${onboarding ? "starts" : "last day"} ${formatDate(data.checklist.startDate)}`}
      actions={canManage ? <Button size="sm" variant="secondary" icon={<IconPlus size={14} />} onClick={() => setAdding(true)}>Add task</Button> : undefined}>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-subtle" role="progressbar" aria-valuemin={0} aria-valuemax={tasks.length} aria-valuenow={done}>
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(done / tasks.length) * 100}%` }} />
      </div>
      {problem && <div className="mb-3"><ErrorNote error={problem} /></div>}
      <div className="space-y-6">
        {[...groups].map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-muted">{category}</h3>
            <ul className="divide-y divide-line rounded-xl border border-line">
              {items.map((t) => {
                const late = !t.completedAt && t.dueDate && t.dueDate < now;
                return (
                  <li key={t.id} className="group flex items-start gap-3 px-4 py-3">
                    <button type="button" disabled={!t.canComplete} onClick={() => void toggle(t)}
                      aria-label={t.completedAt ? `Mark "${t.title}" not done` : `Mark "${t.title}" done`}
                      className={cx("mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border transition",
                        t.completedAt ? "border-brand bg-brand text-white" : "border-line-strong bg-surface",
                        t.canComplete ? "hover:border-brand" : "cursor-not-allowed opacity-50")}>
                      {t.completedAt && <IconCheck size={13} strokeWidth={2.4} />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cx("text-[15px]", t.completedAt ? "text-muted line-through" : "text-ink")}>{t.title}</p>
                      {t.description && <p className="mt-0.5 text-xs text-muted">{t.description}</p>}
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <Badge>{ASSIGNEES.find((a) => a.value === t.assignee)?.label}</Badge>
                        {t.dueDate && <span className={late ? "font-medium text-red-600" : undefined}>{late ? "Overdue · " : "Due "}{formatDate(t.dueDate)}</span>}
                        {t.completedAt && <span>Done {formatDate(t.completedAt.slice(0, 10))}{t.completedByName ? ` by ${t.completedByName}` : ""}</span>}
                      </p>
                    </div>
                    {canManage && (
                      <IconButton label="Delete task" className="opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                        onClick={async () => { await remove({ id: t.id }); refresh(); }}>
                        <IconTrash size={15} />
                      </IconButton>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {adding && <AddTaskDialog employeeId={e.id} kind={kind} onClose={() => setAdding(false)} onSaved={() => { setAdding(false); refresh(); onSaved("Task added."); }} />}
    </ProfileSection>
  );
}
