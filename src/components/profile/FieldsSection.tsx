"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "urql";

import { displayValue } from "@/components/employees/RecordCards";
import { IconLock } from "@/components/icons";
import { Button, ErrorNote, Input, Select, cx } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";

import { FIELDS, PERSONAL_KEYS, rawValue, shownValue, type FieldKey } from "./fields";
import type { LayoutItem, Profile } from "./query";
import { ProfileSection } from "./Section";

const UpdateEmployeeFieldsDocument = graphql(`
  mutation UpdateEmployeeFields($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) { employee { id } errors { field message } }
  }
`);

const UpdateMyFieldsDocument = graphql(`
  mutation UpdateMyFields($input: MyDetailsInput!) {
    updateMyDetails(input: $input) { applied request { id } errors { field message } }
  }
`);

const SetCustomFieldsDocument = graphql(`
  mutation SetCustomFields($employeeId: ID!, $values: JSON!) {
    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }
  }
`);

type CustomValue = Profile["customValues"][number];

/** One row of the section: a standard field, a group shown side by side, or a custom field. */
type Row =
  | { kind: "fields"; id: string; keys: FieldKey[] }
  | { kind: "custom"; id: string; value: CustomValue };

const camel = (key: string) => key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

export function rowsFor(items: LayoutItem[], e: Profile): Row[] {
  const seesPersonal = e.personal !== null;
  const rows: Row[] = [];
  for (const item of items) {
    if (item.kind === "field" || item.kind === "group") {
      const keys = (item.kind === "group" ? item.fields : [item.key]) as FieldKey[];
      // Without access to personal details the API sends them empty; leave them out rather than show blanks.
      const visible = keys.filter((k) => FIELDS[k] && (seesPersonal || !PERSONAL_KEYS.includes(k)));
      if (visible.length) rows.push({ kind: "fields", id: item.id, keys: visible });
    } else if (item.kind === "custom") {
      const value = e.customValues.find((v) => v.field.key === item.key);
      if (value) rows.push({ kind: "custom", id: item.id, value });
    }
  }
  return rows;
}

function Read({ label, value, hrOnly }: { label: string; value: string | null; hrOnly?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[13px] text-muted">{label}{hrOnly && <IconLock size={11} aria-label="HR only" />}</dt>
      <dd className="mt-0.5 break-words text-[15px] text-ink">{value ?? <span className="text-muted">—</span>}</dd>
    </div>
  );
}

export function FieldsSection({ title, icon, rows, employee: e, canManage, isSelf, onSaved }: {
  title: string; icon: string; rows: Row[]; employee: Profile; canManage: boolean; isSelf: boolean;
  onSaved: (message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [, updateEmployee] = useMutation(UpdateEmployeeFieldsDocument);
  const [, updateMine] = useMutation(UpdateMyFieldsDocument);
  const [, setCustom] = useMutation(SetCustomFieldsDocument);

  const editable = (key: FieldKey) => FIELDS[key].input !== "readonly" && (canManage || (isSelf && Boolean(FIELDS[key].self)));
  const canEdit = rows.some((r) => (r.kind === "fields" ? r.keys.some(editable) : canManage));

  function start() {
    const initial: Record<string, string> = {};
    for (const r of rows) {
      if (r.kind === "fields") r.keys.forEach((k) => { initial[k] = rawValue(e, k); });
      else initial[`custom:${r.value.field.key}`] = r.value.value === null || r.value.value === undefined ? ""
        : r.value.field.fieldType === "YES_NO" ? (r.value.value ? "yes" : "no") : String(r.value.value);
    }
    setValues(initial);
    setErrors({});
    setFormError(undefined);
    setEditing(true);
  }

  async function save(ev: FormEvent) {
    ev.preventDefault();
    setFormError(undefined);
    const standard: Record<string, string | null> = {};
    const custom: Record<string, string | null> = {};
    for (const r of rows) {
      if (r.kind === "fields") {
        for (const k of r.keys) if (editable(k) && values[k] !== rawValue(e, k)) standard[FIELDS[k].api] = values[k] || null;
      } else if (canManage) {
        const key = `custom:${r.value.field.key}`;
        custom[r.value.field.key] = values[key] || null;
      }
    }
    setBusy(true);
    const found: Record<string, string> = {};
    let message = "Saved.";
    try {
      if (Object.keys(standard).length) {
        const fieldErrors = canManage
          ? await updateEmployee({ input: { id: e.id, ...standard } }).then((r) => { if (r.error) throw r.error; return r.data?.updateEmployee.errors ?? []; })
          : await updateMine({ input: standard }).then((r) => {
            if (r.error) throw r.error;
            if (r.data?.updateMyDetails.request) message = "Saved. Name changes have gone to HR to approve.";
            return r.data?.updateMyDetails.errors ?? [];
          });
        for (const err of fieldErrors) {
          const key = (Object.keys(FIELDS) as FieldKey[]).find((k) => FIELDS[k].api === err.field);
          if (key) found[key] = err.message;
          else setFormError(err.message);
        }
      }
      if (!Object.keys(found).length && Object.keys(custom).length) {
        const result = await setCustom({ employeeId: e.id, values: custom });
        if (result.error) throw result.error;
        for (const err of result.data?.setEmployeeCustomValues.errors ?? []) {
          const key = rows.find((r) => r.kind === "custom" && camel(r.value.field.key) === err.field);
          if (key && key.kind === "custom") found[`custom:${key.value.field.key}`] = err.message;
          else setFormError(err.message);
        }
      }
    } catch (err) {
      setFormError(errorMessage(err as never) ?? "Something went wrong.");
      setBusy(false);
      return;
    }
    setBusy(false);
    setErrors(found);
    if (!Object.keys(found).length) {
      setEditing(false);
      onSaved(message);
    }
  }

  if (!rows.length) return null;

  const input = (key: string, label: string, kind: string, options?: { value: string; label: string }[], choices?: string[]) => {
    const value = values[key] ?? "";
    const set = (v: string) => setValues((s) => ({ ...s, [key]: v }));
    if (kind === "select" || choices) {
      const opts = options ?? (choices ?? []).map((c) => ({ value: c, label: c }));
      return (
        <Select aria-label={label} value={value} onChange={(ev) => set(ev.target.value)}>
          <option value="">Not set</option>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      );
    }
    return <Input aria-label={label} type={kind === "readonly" ? "text" : kind} value={value} aria-invalid={!!errors[key]}
      onChange={(ev) => set(ev.target.value)} />;
  };

  return (
    <ProfileSection title={title} icon={icon}
      actions={canEdit && !editing ? <Button size="sm" variant="ghost" className="-my-1 -mr-2" onClick={start}>Edit</Button> : undefined}>
      <form onSubmit={save} noValidate>
        {formError && <div className="mb-4"><ErrorNote error={formError} /></div>}
        <dl className="space-y-5">
          {rows.map((r) => r.kind === "fields" ? (
            <div key={r.id} className={cx("grid gap-x-5 gap-y-4", r.keys.length > 1 ? "sm:grid-cols-2 lg:grid-cols-4" : "max-w-md")}>
              {r.keys.map((k) => {
                const meta = FIELDS[k];
                const wide = meta.wide && r.keys.length > 1 ? "lg:col-span-2" : "";
                if (!editing || !editable(k)) {
                  return <div key={k} className={wide}><Read label={meta.label} value={shownValue(e, k)} /></div>;
                }
                return (
                  <label key={k} className={cx("block", wide)}>
                    <span className="mb-1.5 block text-[13px] font-medium text-ink">
                      {meta.label}
                      {!canManage && meta.self === "review" && <span className="ml-1.5 text-xs font-normal text-muted">HR approves</span>}
                    </span>
                    {input(k, meta.label, meta.input, meta.options)}
                    {errors[k] && <span className="mt-1.5 block text-xs text-red-600">{errors[k]}</span>}
                  </label>
                );
              })}
            </div>
          ) : (
            <div key={r.id} className="max-w-md">
              {!editing || !canManage ? (
                <Read label={r.value.field.name} value={displayValue(r.value)} hrOnly={r.value.field.hrOnly} />
              ) : (
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-ink">{r.value.field.name}</span>
                  {r.value.field.fieldType === "YES_NO"
                    ? input(`custom:${r.value.field.key}`, r.value.field.name, "select", [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }])
                    : r.value.field.fieldType === "CHOICE"
                      ? input(`custom:${r.value.field.key}`, r.value.field.name, "select", undefined, r.value.field.choices)
                      : input(`custom:${r.value.field.key}`, r.value.field.name, r.value.field.fieldType === "DATE" ? "date" : "text")}
                  {r.value.field.helpText && <span className="mt-1.5 block text-xs text-muted">{r.value.field.helpText}</span>}
                  {errors[`custom:${r.value.field.key}`] && <span className="mt-1.5 block text-xs text-red-600">{errors[`custom:${r.value.field.key}`]}</span>}
                </label>
              )}
            </div>
          ))}
        </dl>
        {editing && (
          <div className="mt-6 flex gap-2 border-t border-line pt-4">
            <Button type="submit" busy={busy}>Save changes</Button>
            <Button variant="secondary" onClick={() => setEditing(false)} disabled={busy}>Cancel</Button>
          </div>
        )}
      </form>
    </ProfileSection>
  );
}
