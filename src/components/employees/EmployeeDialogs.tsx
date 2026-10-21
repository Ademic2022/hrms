"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { z } from "zod";

import { Button, Dialog, ErrorNote, Field, Input, Select } from "@/components/ui";
import { graphql } from "@/gql";
import type { EmployeeQuery, EmployeeStatus, EmploymentType, Gender, JobChangeType, PayFrequency } from "@/gql/graphql";
import { reportErrors, today } from "@/lib/forms";

export type ProfileEmployee = EmployeeQuery["employee"];

interface DialogProps {
  employee: ProfileEmployee;
  onClose: () => void;
  /** Called after a successful save, so the page can reload the record. */
  onSaved: () => void;
}

const optionalDate = z.union([z.literal(""), z.iso.date("Enter a valid date.")]);
const optionalEmail = z.union([z.literal(""), z.email("Enter a valid email address.")]);

/* ------------------------------------------------------------ Personal details */

const UpdateEmployeeDocument = graphql(`
  mutation UpdateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      employee { id }
      errors { field message }
    }
  }
`);

const GENDERS: { value: Gender; label: string }[] = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "OTHER", label: "Other" },
  { value: "UNDISCLOSED", label: "Prefer not to say" },
];

const personalSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name."),
  middleName: z.string().trim(),
  lastName: z.string().trim().min(1, "Enter a last name."),
  preferredName: z.string().trim(),
  workEmail: optionalEmail,
  personalEmail: optionalEmail,
  phone: z.string().trim().max(20, "Use at most 20 characters."),
  dateOfBirth: optionalDate,
  gender: z.union([z.literal(""), z.enum(["FEMALE", "MALE", "OTHER", "UNDISCLOSED"])]),
});

type PersonalValues = z.infer<typeof personalSchema>;
const PERSONAL_FIELDS = Object.keys(personalSchema.shape) as (keyof PersonalValues)[];

export function EditPersonalDialog({ employee: e, onClose, onSaved }: DialogProps) {
  const [, update] = useMutation(UpdateEmployeeDocument);
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: e.firstName, middleName: e.middleName, lastName: e.lastName, preferredName: e.preferredName,
      workEmail: e.workEmail, personalEmail: e.personalEmail, phone: e.phone, dateOfBirth: e.dateOfBirth ?? "",
      gender: e.gender ?? "",
    },
  });

  async function onSubmit(v: PersonalValues) {
    setFormError(undefined);
    const result = await update({
      input: { id: e.id, ...v, dateOfBirth: v.dateOfBirth || null, gender: v.gender || null },
    });
    const failed = reportErrors(result, result.data?.updateEmployee.errors, PERSONAL_FIELDS,
      (f, message) => setError(f, { message }), setFormError);
    if (!failed) onSaved();
  }

  const text = (name: keyof PersonalValues, label: string, type = "text", optional = false) => (
    <Field label={label} error={errors[name]?.message} optional={optional}>
      <Input type={type} aria-invalid={!!errors[name]} {...register(name)} />
    </Field>
  );

  return (
    <Dialog open wide onClose={onClose} title="Edit personal details" description="Job and pay changes have their own effective-dated forms."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" form="personal-form" busy={isSubmitting}>Save</Button>
      </>}>
      <form id="personal-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <div className="grid gap-4 sm:grid-cols-2">
          {text("firstName", "First name")}
          {text("lastName", "Last name")}
          {text("middleName", "Middle name", "text", true)}
          {text("preferredName", "Preferred name", "text", true)}
          {text("workEmail", "Work email", "email", true)}
          {text("personalEmail", "Personal email", "email", true)}
          {text("phone", "Phone", "tel", true)}
          {text("dateOfBirth", "Date of birth", "date", true)}
          <Field label="Gender" optional>
            <Select {...register("gender")}>
              <option value="">Not recorded</option>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </Select>
          </Field>
        </div>
      </form>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ Job change */

export const JobOptionsDocument = graphql(`
  query JobOptions {
    legalEntities { id name isActive }
    departments { id name isActive legalEntity { id } }
    locations { id name isActive legalEntity { id } }
    jobTitles { id name isActive }
    grades { id name isActive }
    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }
  }
`);

/** Active units only, plus the one currently assigned so a retired unit still shows by name. */
export function activeOptions<T extends { id: string; isActive: boolean }>(items: T[] | undefined, keep?: string | null) {
  return (items ?? []).filter((i) => i.isActive || i.id === keep);
}

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
];

const ChangeJobDocument = graphql(`
  mutation ChangeEmployeeJob($input: ChangeJobInput!) {
    changeEmployeeJob(input: $input) {
      employee { id }
      errors { field message }
    }
  }
`);

const CHANGE_TYPES: { value: JobChangeType; label: string }[] = [
  { value: "PROMOTION", label: "Promotion" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "CHANGE", label: "Other job change" },
];

const jobSchema = z.object({
  effectiveDate: z.iso.date("Choose the date the change takes effect."),
  changeType: z.enum(["PROMOTION", "TRANSFER", "CHANGE"]),
  reason: z.string().trim().max(255),
  legalEntityId: z.string().min(1, "Choose a legal entity."),
  departmentId: z.string(),
  locationId: z.string(),
  jobTitleId: z.string(),
  gradeId: z.string(),
  managerId: z.string(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),
});

type JobValues = z.infer<typeof jobSchema>;
const JOB_FIELDS = Object.keys(jobSchema.shape) as (keyof JobValues)[];
const JOB_REFS = ["legalEntityId", "departmentId", "locationId", "jobTitleId", "gradeId", "managerId", "employmentType"] as const;

export function ChangeJobDialog({ employee: e, onClose, onSaved }: DialogProps) {
  const [{ data }] = useQuery({ query: JobOptionsDocument });
  const [, changeJob] = useMutation(ChangeJobDocument);
  const [formError, setFormError] = useState<string>();
  const current: Pick<JobValues, (typeof JOB_REFS)[number]> = {
    legalEntityId: e.legalEntity.id, departmentId: e.department?.id ?? "", locationId: e.location?.id ?? "",
    jobTitleId: e.jobTitle?.id ?? "", gradeId: e.grade?.id ?? "", managerId: e.manager?.id ?? "",
    employmentType: e.employmentType,
  };
  const { register, handleSubmit, control, setError, formState: { errors, isSubmitting } } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: { effectiveDate: today(), changeType: "PROMOTION", reason: "", ...current },
  });
  const entityId = useWatch({ control, name: "legalEntityId" });

  async function onSubmit(v: JobValues) {
    setFormError(undefined);
    // Only what changed goes in, so the history and audit log show the real change.
    const changed = Object.fromEntries(
      JOB_REFS.filter((k) => v[k] !== current[k]).map((k) => [k, v[k] || null]),
    );
    if (!Object.keys(changed).length) {
      setFormError("Nothing has changed. Pick a new job title, department, manager or other detail.");
      return;
    }
    const result = await changeJob({
      input: { id: e.id, effectiveDate: v.effectiveDate, changeType: v.changeType, reason: v.reason || null, ...changed },
    });
    const failed = reportErrors(result, result.data?.changeEmployeeJob.errors, JOB_FIELDS,
      (f, message) => setError(f, { message }), setFormError);
    if (!failed) onSaved();
  }

  const choice = (name: keyof JobValues, label: string, options: { id: string; name: string }[], empty = "None") => (
    <Field label={label} error={errors[name]?.message}>
      <Select aria-invalid={!!errors[name]} {...register(name)}>
        <option value="">{empty}</option>
        {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </Select>
    </Field>
  );
  const inEntity = <T extends { id: string; isActive: boolean; legalEntity: { id: string } }>(items: T[] | undefined, keep: string) =>
    activeOptions(items, keep).filter((i) => i.legalEntity.id === entityId);

  return (
    <Dialog open wide onClose={onClose} title="Change job"
      description="Records a new entry in the employment history. A future date takes effect on that day."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" form="job-form" busy={isSubmitting} disabled={!data}>Save change</Button>
      </>}>
      <form id="job-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type of change">
            <Select {...register("changeType")}>
              {CHANGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </Field>
          <Field label="Effective from" error={errors.effectiveDate?.message}>
            <Input type="date" aria-invalid={!!errors.effectiveDate} {...register("effectiveDate")} />
          </Field>
        </div>
        <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          {choice("jobTitleId", "Job title", activeOptions(data?.jobTitles, current.jobTitleId))}
          {choice("gradeId", "Grade", activeOptions(data?.grades, current.gradeId))}
          {choice("legalEntityId", "Legal entity", activeOptions(data?.legalEntities, current.legalEntityId), "Choose…")}
          {choice("departmentId", "Department", inEntity(data?.departments, current.departmentId))}
          {choice("locationId", "Location", inEntity(data?.locations, current.locationId))}
          {choice("managerId", "Manager",
            (data?.employees.nodes ?? []).filter((m) => m.id !== e.id).map((m) => ({ id: m.id, name: m.fullName })))}
          <Field label="Employment type">
            <Select {...register("employmentType")}>
              {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Reason" optional hint="Shown in the employment history.">
          <Input {...register("reason")} placeholder="Annual review" />
        </Field>
      </form>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ Pay change */

const ChangePayDocument = graphql(`
  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {
    changeEmployeeCompensation(input: $input) {
      employee { id }
      errors { field message }
    }
  }
`);

export const FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "MONTHLY", label: "Per month" },
  { value: "ANNUAL", label: "Per year" },
  { value: "HOURLY", label: "Per hour" },
];

const paySchema = z.object({
  amount: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 450000 or 450000.50."),
  frequency: z.enum(["MONTHLY", "ANNUAL", "HOURLY"]),
  effectiveDate: z.iso.date("Choose the date the new pay starts."),
  reason: z.string().trim().max(255),
});

type PayValues = z.infer<typeof paySchema>;

export function ChangePayDialog({ employee: e, currency, onClose, onSaved }: DialogProps & { currency: string }) {
  const [, changePay] = useMutation(ChangePayDocument);
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<PayValues>({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amount: "", frequency: e.compensation?.frequency ?? "MONTHLY", effectiveDate: today(), reason: "",
    },
  });

  async function onSubmit(v: PayValues) {
    setFormError(undefined);
    const result = await changePay({
      input: { id: e.id, amount: v.amount, frequency: v.frequency, effectiveDate: v.effectiveDate, reason: v.reason || null,
        currency: e.compensation?.currency ?? currency },
    });
    const failed = reportErrors(result, result.data?.changeEmployeeCompensation.errors, Object.keys(paySchema.shape) as (keyof PayValues)[],
      (f, message) => setError(f, { message }), setFormError);
    if (!failed) onSaved();
  }

  return (
    <Dialog open onClose={onClose} title="Change pay" description="Adds a new pay record. Earlier records stay in the pay history."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" form="pay-form" busy={isSubmitting}>Save pay</Button>
      </>}>
      <form id="pay-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <Field label={`New base pay (${e.compensation?.currency ?? currency})`} error={errors.amount?.message}>
            <Input inputMode="decimal" className="tabular-nums" aria-invalid={!!errors.amount} {...register("amount")} />
          </Field>
          <Field label="Frequency">
            <Select {...register("frequency")}>
              {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Effective from" error={errors.effectiveDate?.message}>
          <Input type="date" aria-invalid={!!errors.effectiveDate} {...register("effectiveDate")} />
        </Field>
        <Field label="Reason" optional>
          <Input {...register("reason")} placeholder="Annual increase" />
        </Field>
      </form>
    </Dialog>
  );
}

/* --------------------------------------------------------------- Status change */

const ChangeStatusDocument = graphql(`
  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {
    changeEmployeeStatus(input: $input) {
      employee { id }
      errors { field message }
    }
  }
`);

// Mirrors STATUS_TRANSITIONS in apps/core_hr/models.py; the API has the final say.
const NEXT_STATUSES: Record<EmployeeStatus, { value: EmployeeStatus; label: string }[]> = {
  CANDIDATE: [{ value: "PROBATION", label: "Start probation" }, { value: "ACTIVE", label: "Make active" }, { value: "TERMINATED", label: "Did not join" }],
  PROBATION: [{ value: "ACTIVE", label: "Confirm (probation passed)" }, { value: "ON_LEAVE", label: "Put on leave" }, { value: "TERMINATED", label: "End employment" }],
  ACTIVE: [{ value: "ON_LEAVE", label: "Put on leave" }, { value: "TERMINATED", label: "End employment" }],
  ON_LEAVE: [{ value: "ACTIVE", label: "Return to work" }, { value: "PROBATION", label: "Return on probation" }, { value: "TERMINATED", label: "End employment" }],
  TERMINATED: [],
};

export function canChangeStatus(status: EmployeeStatus) {
  return NEXT_STATUSES[status].length > 0;
}

const statusSchema = z.object({
  status: z.enum(["CANDIDATE", "PROBATION", "ACTIVE", "ON_LEAVE", "TERMINATED"]),
  effectiveDate: z.iso.date("Choose a date."),
  reason: z.string().trim().max(255),
}).refine((v) => v.status !== "TERMINATED" || v.reason.length > 0, {
  path: ["reason"], message: "Give a reason for leaving. It is kept on the record.",
});

type StatusValues = z.infer<typeof statusSchema>;

export function ChangeStatusDialog({ employee: e, onClose, onSaved }: DialogProps) {
  const [, changeStatus] = useMutation(ChangeStatusDocument);
  const [formError, setFormError] = useState<string>();
  const options = NEXT_STATUSES[e.status];
  const { register, handleSubmit, control, setError, formState: { errors, isSubmitting } } = useForm<StatusValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: options[0]?.value, effectiveDate: today(), reason: "" },
  });
  const status = useWatch({ control, name: "status" });
  const leaving = status === "TERMINATED";

  async function onSubmit(v: StatusValues) {
    setFormError(undefined);
    const result = await changeStatus({ input: { id: e.id, status: v.status, effectiveDate: v.effectiveDate, reason: v.reason || null } });
    const failed = reportErrors(result, result.data?.changeEmployeeStatus.errors, ["status", "effectiveDate", "reason"] as const,
      (f, message) => setError(f, { message }), setFormError);
    if (!failed) onSaved();
  }

  return (
    <Dialog open onClose={onClose} title="Change status" description={`${e.fullName} is currently ${statusWord(e.status)}.`}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" form="status-form" variant={leaving ? "danger" : "primary"} busy={isSubmitting}>
          {leaving ? "End employment" : "Save status"}
        </Button>
      </>}>
      <form id="status-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <Field label="New status" error={errors.status?.message}>
          <Select {...register("status")}>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label={leaving ? "Last working day" : "Effective from"} error={errors.effectiveDate?.message}>
          <Input type="date" aria-invalid={!!errors.effectiveDate} {...register("effectiveDate")} />
        </Field>
        <Field label={leaving ? "Reason for leaving" : "Note"} optional={!leaving} error={errors.reason?.message}
          hint={leaving ? "Their direct reports move to their manager. This cannot be undone." : undefined}>
          <Input aria-invalid={!!errors.reason} {...register("reason")} placeholder={leaving ? "Resigned" : undefined} />
        </Field>
      </form>
    </Dialog>
  );
}

function statusWord(status: EmployeeStatus) {
  return { CANDIDATE: "a candidate", PROBATION: "on probation", ACTIVE: "active", ON_LEAVE: "on leave", TERMINATED: "no longer employed" }[status];
}
