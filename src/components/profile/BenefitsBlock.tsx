"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "urql";

import { IconPlus } from "@/components/icons";
import { ActionDialog, Badge, Button, Dialog, ErrorNote, Field, Input, Select, Table, TD, TH } from "@/components/ui";
import { graphql } from "@/gql";
import type { BenefitCoverage, BenefitEnrollmentStatus, EmployeeBenefitsQuery } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { reportErrors } from "@/lib/forms";

import type { Profile } from "./query";
import { ProfileSection } from "./Section";

export const EmployeeBenefitsDocument = graphql(`
  query EmployeeBenefits($employeeId: ID!) {
    employeeBenefits(employeeId: $employeeId) {
      id status startDate endDate memberNumber coverage dependants note
      plan { id name kind provider employeeRate employerRate basis statutory }
    }
    benefitPlans { id name kind provider employeeRate employerRate basis statutory isActive }
  }
`);

const SaveEnrollmentDocument = graphql(`
  mutation SaveBenefitEnrollment($input: SaveEnrollmentInput!) {
    saveBenefitEnrollment(input: $input) { enrollment { id } errors { field message } }
  }
`);

const DeleteEnrollmentDocument = graphql(`
  mutation DeleteBenefitEnrollment($id: ID!) {
    deleteBenefitEnrollment(id: $id)
  }
`);

type Enrollment = EmployeeBenefitsQuery["employeeBenefits"][number];
type Plan = EmployeeBenefitsQuery["benefitPlans"][number];

const STATUSES: { value: BenefitEnrollmentStatus; label: string }[] = [
  { value: "ENROLLED", label: "Enrolled" }, { value: "PENDING", label: "Pending" },
  { value: "WAIVED", label: "Waived" }, { value: "ENDED", label: "Ended" },
];
const COVERAGE: { value: BenefitCoverage; label: string }[] = [
  { value: "EMPLOYEE", label: "Employee only" }, { value: "SPOUSE", label: "Employee and spouse" },
  { value: "CHILDREN", label: "Employee and children" }, { value: "FAMILY", label: "Family" },
];
const BASIS: Record<string, string> = {
  BASIC: "basic", BHT: "basic, housing and transport", GROSS: "gross pay", ANNUAL_EMOLUMENTS: "annual emoluments", FIXED: "",
};
const TONES = { ENROLLED: "good", PENDING: "warn", WAIVED: "neutral", ENDED: "neutral" } as const;

/** "Employee 8% · Employer 10% of basic, housing and transport" */
export function rates(plan: Pick<Plan, "employeeRate" | "employerRate" | "basis">) {
  const parts = [
    plan.employeeRate !== null && plan.employeeRate !== undefined && `Employee ${Number(plan.employeeRate)}%`,
    plan.employerRate !== null && plan.employerRate !== undefined && `Employer ${Number(plan.employerRate)}%`,
  ].filter(Boolean);
  if (!parts.length) return "";
  const basis = plan.basis ? BASIS[plan.basis] : "";
  return `${parts.join(" · ")}${basis ? ` of ${basis}` : ""}`;
}

function EnrollmentDialog({ employeeId, plans, enrollment, onClose, onSaved }: {
  employeeId: string; plans: Plan[]; enrollment: Enrollment | null; onClose: () => void; onSaved: () => void;
}) {
  const [, save] = useMutation(SaveEnrollmentDocument);
  const [v, setV] = useState({
    planId: enrollment?.plan.id ?? plans[0]?.id ?? "", status: enrollment?.status ?? "ENROLLED",
    startDate: enrollment?.startDate ?? "", endDate: enrollment?.endDate ?? "", memberNumber: enrollment?.memberNumber ?? "",
    coverage: enrollment?.coverage ?? "", dependants: String(enrollment?.dependants ?? 0), note: enrollment?.note ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof v, value: string) => setV((s) => ({ ...s, [k]: value }));
  const plan = plans.find((p) => p.id === v.planId) ?? enrollment?.plan;

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setFormError(undefined);
    setBusy(true);
    const result = await save({ input: {
      id: enrollment?.id ?? null, employeeId, planId: v.planId, status: v.status as BenefitEnrollmentStatus,
      startDate: v.startDate || null, endDate: v.endDate || null, memberNumber: v.memberNumber,
      coverage: (v.coverage || null) as BenefitCoverage | null, dependants: Number(v.dependants) || 0, note: v.note,
    } });
    setBusy(false);
    const found: Record<string, string> = {};
    const failed = reportErrors(result, result.data?.saveBenefitEnrollment.errors,
      ["planId", "status", "startDate", "endDate", "memberNumber", "coverage", "dependants", "note"] as const,
      (f, m) => { found[f] = m; }, setFormError);
    setErrors(found);
    if (!failed) onSaved();
  }

  return (
    <Dialog open wide onClose={onClose} title={enrollment ? `Edit ${enrollment.plan.name}` : "Add benefit"}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="benefit-form" busy={busy}>Save</Button>
      </>}>
      <form id="benefit-form" onSubmit={submit} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Plan" error={errors.planId}>
            <Select value={v.planId} disabled={!!enrollment} onChange={(e) => set("planId", e.target.value)}>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Status" error={errors.status}>
            <Select value={v.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </Field>
          <Field label="Start date" optional error={errors.startDate}><Input type="date" value={v.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field>
          <Field label="End date" optional={v.status !== "ENDED"} error={errors.endDate}><Input type="date" value={v.endDate} onChange={(e) => set("endDate", e.target.value)} /></Field>
          <Field label={plan?.kind === "PENSION" ? "RSA PIN" : plan?.kind === "NHF" ? "NHF number" : plan?.kind === "HEALTH" ? "Enrollee ID" : "Member or policy number"}
            optional error={errors.memberNumber}>
            <Input value={v.memberNumber} onChange={(e) => set("memberNumber", e.target.value)} />
          </Field>
          {plan?.kind === "HEALTH" && (
            <>
              <Field label="Cover" optional error={errors.coverage}>
                <Select value={v.coverage} onChange={(e) => set("coverage", e.target.value)}>
                  <option value="">Not set</option>
                  {COVERAGE.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </Select>
              </Field>
              <Field label="Dependants" optional error={errors.dependants}>
                <Input inputMode="numeric" value={v.dependants} onChange={(e) => set("dependants", e.target.value)} />
              </Field>
            </>
          )}
          <div className="sm:col-span-2">
            <Field label="Note" optional error={errors.note}><Input value={v.note} onChange={(e) => set("note", e.target.value)} /></Field>
          </div>
        </div>
        {plan && rates(plan) && <p className="text-xs text-muted">{rates(plan)}</p>}
      </form>
    </Dialog>
  );
}

export function BenefitsBlock({ e, title, icon, canManage, onSaved }: {
  e: Profile; title: string; icon: string; canManage: boolean; onSaved: (message: string) => void;
}) {
  const [{ data, error }, reload] = useQuery({ query: EmployeeBenefitsDocument, variables: { employeeId: e.id } });
  const [editing, setEditing] = useState<{ enrollment: Enrollment | null } | null>(null);
  const [removing, setRemoving] = useState<Enrollment | null>(null);
  const [, remove] = useMutation(DeleteEnrollmentDocument);
  if (error || !data) return null;
  const enrollments = data.employeeBenefits;
  const done = (message: string) => { setEditing(null); reload({ requestPolicy: "network-only" }); onSaved(message); };
  const onPlan = new Set(enrollments.filter((x) => x.status !== "ENDED").map((x) => x.plan.id));
  const missing = data.benefitPlans.filter((p) => p.statutory && !onPlan.has(p.id));

  return (
    <ProfileSection title={title} icon={icon} flush description="Pension, NHF, health and other cover. Payroll works out the deductions."
      actions={canManage ? <Button size="sm" variant="secondary" icon={<IconPlus size={14} />} onClick={() => setEditing({ enrollment: null })}>Add benefit</Button> : undefined}>
      {canManage && missing.length > 0 && (
        <p className="mx-5 mb-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 sm:mx-6 dark:text-amber-300">
          Not on {missing.map((p) => p.name).join(", ")}. These are statutory for eligible employees.
        </p>
      )}
      {enrollments.length ? (
        <Table>
          <thead>
            <tr>
              <TH>Plan</TH><TH>Status</TH><TH className="hidden md:table-cell">Contributions</TH>
              <TH className="hidden sm:table-cell">Member no.</TH><TH className="hidden lg:table-cell">Dates</TH>{canManage && <TH />}
            </tr>
          </thead>
          <tbody>
            {enrollments.map((x) => (
              <tr key={x.id}>
                <TD>
                  <span className="font-medium text-ink">{x.plan.name}</span>
                  <span className="block text-xs text-muted">
                    {[x.plan.provider, x.coverage && COVERAGE.find((c) => c.value === x.coverage)?.label,
                      x.dependants ? `${x.dependants} dependant${x.dependants === 1 ? "" : "s"}` : ""].filter(Boolean).join(" · ") || "—"}
                  </span>
                </TD>
                <TD><Badge tone={TONES[x.status]} dot>{STATUSES.find((s) => s.value === x.status)?.label}</Badge></TD>
                <TD className="hidden text-muted md:table-cell">{rates(x.plan) || "—"}</TD>
                <TD className="hidden tabular-nums sm:table-cell">{x.memberNumber || "—"}</TD>
                <TD className="hidden whitespace-nowrap text-muted lg:table-cell">
                  {x.startDate ? formatDate(x.startDate) : "—"}{x.endDate ? ` – ${formatDate(x.endDate)}` : ""}
                </TD>
                {canManage && (
                  <TD align="right" className="whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => setEditing({ enrollment: x })}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemoving(x)}>Remove</Button>
                  </TD>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : <p className="px-5 pb-5 text-sm text-muted sm:px-6">Not enrolled on any benefits yet.</p>}
      {editing && (
        <EnrollmentDialog employeeId={e.id} plans={data.benefitPlans.filter((p) => p.isActive)} enrollment={editing.enrollment}
          onClose={() => setEditing(null)} onSaved={() => done("Benefit saved.")} />
      )}
      <ActionDialog open={removing !== null} onClose={() => setRemoving(null)} title={`Remove ${removing?.plan.name ?? "benefit"}?`}
        description="Use status Ended instead to keep a record that the cover stopped." confirmLabel="Remove" tone="danger"
        onConfirm={async () => {
          if (!removing) return;
          const result = await remove({ id: removing.id });
          if (result.error) throw new Error(errorMessage(result.error));
          setRemoving(null);
          done("Benefit removed.");
        }} />
    </ProfileSection>
  );
}
