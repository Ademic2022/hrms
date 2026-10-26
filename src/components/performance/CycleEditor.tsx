"use client";

import { useState } from "react";
import { useMutation } from "urql";

import { Button, Checkbox, Dialog, ErrorNote, Field, Input, Select } from "@/components/ui";
import { CYCLE_KINDS, PersonSearch } from "@/components/performance/shared";
import { graphql } from "@/gql";
import type { ReviewCyclesQuery } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";

type Cycle = Omit<ReviewCyclesQuery["reviewCycles"][number], "__typename">;

const SaveCycleDocument = graphql(`
  mutation SaveReviewCycle($input: ReviewCycleInput!) { saveReviewCycle(input: $input) { cycle { id } errors { field message } } }
`);

export function CycleEditor({ cycle, templates, departments, onClose, onSaved }: {
  cycle?: Cycle; templates: ReviewCyclesQuery["reviewTemplates"]; departments: ReviewCyclesQuery["departments"]; onClose: () => void; onSaved: (id: string) => void;
}) {
  const year = new Date().getFullYear();
  const draft = !cycle || cycle.status === "draft";
  const [v, setV] = useState({
    name: cycle?.name ?? `${year} annual review`, kind: cycle?.kind ?? "annual", templateId: cycle?.templateId ?? templates.find((t) => t.isActive)?.id ?? "",
    periodStart: cycle?.periodStart ?? `${year}-01-01`, periodEnd: cycle?.periodEnd ?? `${year}-12-31`, selfDue: cycle?.selfDue ?? "", managerDue: cycle?.managerDue ?? "",
    includeSelf: cycle?.includeSelf ?? true, includePeers: cycle?.includePeers ?? false,
  });
  const [who, setWho] = useState<"all" | "departments" | "people">(cycle?.employeeIds.length ? "people" : cycle?.departmentIds.length ? "departments" : "all");
  const [deps, setDeps] = useState<string[]>(cycle?.departmentIds ?? []);
  const [people, setPeople] = useState<{ id: string; name: string }[]>((cycle?.employeeIds ?? []).map((id) => ({ id, name: "Chosen earlier" })));
  const [{ fetching }, save] = useMutation(SaveCycleDocument);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (patch: Partial<typeof v>) => setV({ ...v, ...patch });
  const submit = async () => {
    const res = await save({ input: { id: cycle?.id, ...v, selfDue: v.selfDue || null, managerDue: v.managerDue || null,
      departmentIds: who === "departments" ? deps : [], employeeIds: who === "people" ? people.map((p) => p.id) : [] } });
    if (res.error) return setErrors({ "": errorMessage(res.error) ?? "Something went wrong." });
    const errs = res.data?.saveReviewCycle.errors ?? [];
    if (errs.length) return setErrors(Object.fromEntries(errs.map((e) => [e.field ?? "", e.message])));
    onSaved(res.data!.saveReviewCycle.cycle!.id);
  };
  return (
    <Dialog open onClose={onClose} wide title={cycle ? "Edit review cycle" : "New review cycle"}
      description={draft ? "Nothing is sent until you start the cycle." : "The cycle has started: only its name and due dates can change."}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={fetching} onClick={submit}>Save</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        {errors[""] && <div className="sm:col-span-2"><ErrorNote error={errors[""]} /></div>}
        <Field label="Name" error={errors.name}><Input value={v.name} onChange={(e) => set({ name: e.target.value })} /></Field>
        <Field label="Kind" error={errors.kind}>
          <Select value={v.kind} disabled={!draft} onChange={(e) => { const kind = e.target.value; set({ kind }); if (kind === "probation") setWho("people"); }}>
            {Object.entries(CYCLE_KINDS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </Select>
        </Field>
        <Field label="Period from"><Input type="date" disabled={!draft} value={v.periodStart} onChange={(e) => set({ periodStart: e.target.value })} /></Field>
        <Field label="Period to" error={errors.periodEnd}><Input type="date" disabled={!draft} value={v.periodEnd} onChange={(e) => set({ periodEnd: e.target.value })} /></Field>
        <Field label="Self reviews due" optional><Input type="date" value={v.selfDue} onChange={(e) => set({ selfDue: e.target.value })} /></Field>
        <Field label="Manager reviews due" optional error={errors.managerDue}><Input type="date" value={v.managerDue} onChange={(e) => set({ managerDue: e.target.value })} /></Field>
        <Field label="Questions from">
          <Select value={v.templateId} disabled={!draft} onChange={(e) => set({ templateId: e.target.value })}>
            {templates.map((t) => <option key={t.id} value={t.id} disabled={!t.isActive}>{t.name}</option>)}
          </Select>
        </Field>
        <Field label="Who is reviewed" error={errors.employeeIds}>
          <Select value={who} disabled={!draft} onChange={(e) => setWho(e.target.value as typeof who)}>
            <option value="all">Everyone</option><option value="departments">Some departments</option><option value="people">Chosen people</option>
          </Select>
        </Field>
        {draft && who === "departments" && (
          <div className="grid gap-1 sm:col-span-2 sm:grid-cols-3">
            {departments.map((d) => <Checkbox key={d.id} label={d.name} checked={deps.includes(d.id)}
              onChange={(on) => setDeps(on ? [...deps, d.id] : deps.filter((x) => x !== d.id))} />)}
          </div>
        )}
        {draft && who === "people" && (
          <div className="grid gap-2 sm:col-span-2">
            <PersonSearch onPick={(p) => setPeople([...people, p])} exclude={people.map((p) => p.id)} />
            <div className="flex flex-wrap gap-1.5">
              {people.map((p) => (
                <button key={p.id} type="button" onClick={() => setPeople(people.filter((x) => x.id !== p.id))}
                  className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink hover:bg-subtle" title="Remove">{p.name} ×</button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-2 sm:col-span-2">
          <Checkbox disabled={!draft} checked={v.includeSelf} onChange={(includeSelf) => set({ includeSelf })} label="Self reviews"
            description="Each person looks back on their own work first." />
          <Checkbox disabled={!draft} checked={v.includePeers} onChange={(includePeers) => set({ includePeers })} label="Peer reviews"
            description="Managers can ask colleagues for input. Only managers and HR read it." />
        </div>
      </div>
    </Dialog>
  );
}

