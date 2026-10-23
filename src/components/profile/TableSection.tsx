"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "urql";

import { IconPlus } from "@/components/icons";
import { ActionDialog, Button, Dialog, ErrorNote, Field, Input, Select, Table, TD, TH } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { reportErrors } from "@/lib/forms";

import type { CustomTable, Profile } from "./query";
import { ProfileSection } from "./Section";

const SaveRowDocument = graphql(`
  mutation SaveTableRow($input: TableRowInput!) {
    saveTableRow(input: $input) { row { id } errors { field message } }
  }
`);

const DeleteRowDocument = graphql(`
  mutation DeleteTableRow($id: ID!) {
    deleteTableRow(id: $id)
  }
`);

type Row = Profile["tableRows"][number];
type Column = CustomTable["columns"][number];

const camel = (key: string) => key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

function cell(value: unknown, column: Column) {
  if (value === null || value === undefined || value === "") return <span className="text-muted">—</span>;
  if (column.type === "YES_NO") return value ? "Yes" : "No";
  if (column.type === "DATE") return formatDate(String(value));
  if (column.type === "NUMBER") return Number(value).toLocaleString();
  return String(value);
}

export function RowDialog({ table, employeeId, row, onClose, onSaved }: {
  table: CustomTable; employeeId: string; row: Row | null; onClose: () => void; onSaved: () => void;
}) {
  const [, save] = useMutation(SaveRowDocument);
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(table.columns.map((c) => {
    const v = (row?.values as Record<string, unknown> | undefined)?.[c.key];
    return [c.key, v === undefined || v === null ? "" : c.type === "YES_NO" ? (v ? "yes" : "no") : String(v)];
  })));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setFormError(undefined);
    setBusy(true);
    const result = await save({ input: { id: row?.id ?? null, tableKey: table.key, employeeId, values: Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v || null])) } });
    setBusy(false);
    const found: Record<string, string> = {};
    const keys = table.columns.map((c) => c.key);
    const failed = reportErrors(result, result.data?.saveTableRow.errors, keys.map(camel),
      (f, m) => { found[keys.find((k) => camel(k) === f) ?? f] = m; }, setFormError);
    setErrors(found);
    if (!failed) onSaved();
  }

  return (
    <Dialog open wide onClose={onClose} title={row ? `Edit ${table.name.toLowerCase()} entry` : `Add to ${table.name.toLowerCase()}`}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="row-form" busy={busy}>Save</Button>
      </>}>
      <form id="row-form" onSubmit={submit} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <div className="grid gap-4 sm:grid-cols-2">
          {table.columns.map((c) => {
            const set = (v: string) => setValues((s) => ({ ...s, [c.key]: v }));
            return (
              <Field key={c.key} label={c.name} optional error={errors[c.key]}>
                {c.type === "CHOICE" || c.type === "YES_NO" ? (
                  <Select value={values[c.key]} onChange={(e) => set(e.target.value)}>
                    <option value="">Not set</option>
                    {(c.type === "YES_NO" ? ["yes", "no"] : c.choices).map((o) => <option key={o} value={o}>{c.type === "YES_NO" ? (o === "yes" ? "Yes" : "No") : o}</option>)}
                  </Select>
                ) : (
                  <Input type={c.type === "DATE" ? "date" : "text"} inputMode={c.type === "NUMBER" ? "decimal" : undefined}
                    value={values[c.key]} aria-invalid={!!errors[c.key]} onChange={(e) => set(e.target.value)} />
                )}
              </Field>
            );
          })}
        </div>
      </form>
    </Dialog>
  );
}

/** A custom table on the record: its rows for this employee, with Add entry for HR. */
export function TableSection({ table, employee, canManage, title, icon, onSaved }: {
  table: CustomTable; employee: Profile; canManage: boolean; title: string; icon: string; onSaved: (message: string) => void;
}) {
  const rows = employee.tableRows.filter((r) => r.tableKey === table.key);
  const [editing, setEditing] = useState<{ row: Row | null } | null>(null);
  const [removing, setRemoving] = useState<Row | null>(null);
  const [, remove] = useMutation(DeleteRowDocument);
  if (!rows.length && !canManage) return null;

  return (
    <ProfileSection title={title} icon={icon} flush
      actions={canManage ? <Button size="sm" variant="secondary" icon={<IconPlus size={14} />} onClick={() => setEditing({ row: null })}>Add entry</Button> : undefined}>
      {rows.length ? (
        <Table>
          <thead>
            <tr>{table.columns.map((c) => <TH key={c.key}>{c.name}</TH>)}{canManage && <TH align="right"><span className="sr-only">Actions</span></TH>}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {table.columns.map((c) => <TD key={c.key}>{cell((r.values as Record<string, unknown>)[c.key], c)}</TD>)}
                {canManage && (
                  <TD align="right" className="whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => setEditing({ row: r })}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemoving(r)}>Remove</Button>
                  </TD>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="px-5 pb-5 text-sm text-muted sm:px-6">No entries yet.</p>
      )}
      {editing && (
        <RowDialog table={table} employeeId={employee.id} row={editing.row} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onSaved(`${table.name} saved.`); }} />
      )}
      <ActionDialog open={removing !== null} onClose={() => setRemoving(null)} title="Remove this entry?" confirmLabel="Remove" tone="danger"
        description="It is recorded in the audit log." onConfirm={async () => {
          if (!removing) return;
          const result = await remove({ id: removing.id });
          if (result.error) throw new Error(errorMessage(result.error));
          onSaved("Entry removed.");
        }} />
    </ProfileSection>
  );
}
