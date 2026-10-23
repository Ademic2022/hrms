"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import { useMutation } from "urql";

import { IconChevronDown, IconClose, IconGrip, IconPlus } from "@/components/icons";
import { Badge, Button, Checkbox, Dialog, ErrorNote, Field, IconButton, Input, Select, cx } from "@/components/ui";
import { graphql } from "@/gql";
import type { CustomFieldType } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";
import { reportErrors } from "@/lib/forms";

import { SaveProfileLayoutDocument, type CustomFieldRef, type CustomTable, type Layout, type LayoutItem } from "./query";
import { SECTION_ICONS } from "./Section";

const SaveFieldDocument = graphql(`
  mutation SaveLayoutCustomField($input: SaveCustomFieldInput!) {
    saveCustomField(input: $input) { field { id key name } errors { field message } }
  }
`);

const SaveTableDocument = graphql(`
  mutation SaveLayoutCustomTable($input: SaveCustomTableInput!) {
    saveCustomTable(input: $input) { table { id key name } errors { field message } }
  }
`);

interface Section { key: string; title: string; icon: string; items: string[] }
interface Tab { key: string; name: string; builtin: boolean; sections: Section[] }

const KIND_LABEL: Record<string, string> = { field: "Field", group: "Field group", custom: "Custom field", table: "Table", block: "Built-in" };
const TYPES: { value: CustomFieldType; label: string }[] = [
  { value: "TEXT", label: "Text" }, { value: "NUMBER", label: "Number" }, { value: "DATE", label: "Date" },
  { value: "CHOICE", label: "Choice from a list" }, { value: "YES_NO", label: "Yes or no" },
];

function toWorking(layout: Layout): Tab[] {
  return layout.tabs.map((t) => ({ key: t.key, name: t.name, builtin: t.builtin,
    sections: t.sections.map((s) => ({ key: s.key, title: s.title, icon: s.icon, items: s.items.map((i) => i.id) })) }));
}

const newKey = () => Math.random().toString(36).slice(2, 10);

function useSaveLayout(onSaved: () => void) {
  const [, save] = useMutation(SaveProfileLayoutDocument);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  async function run(tabs: Tab[]) {
    setBusy(true);
    setError(undefined);
    const result = await save({ config: { tabs: tabs.map(({ key, name, sections }) => ({ key, name, sections })) } });
    setBusy(false);
    const problem = errorMessage(result.error) ?? result.data?.saveProfileLayout.errors[0]?.message;
    if (problem) return setError(problem);
    onSaved();
  }
  return { run, error, busy };
}

/* ----------------------------------------------------------- New field / table */

function NewFieldDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (item: LayoutItem) => void }) {
  const [, save] = useMutation(SaveFieldDocument);
  const [name, setName] = useState("");
  const [type, setType] = useState<CustomFieldType>("TEXT");
  const [choices, setChoices] = useState("");
  const [hrOnly, setHrOnly] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setErrors({ name: "Enter a name." });
    setBusy(true);
    const result = await save({ input: { name: name.trim(), fieldType: type, hrOnly, choices: choices.split("\n").map((c) => c.trim()).filter(Boolean) } });
    setBusy(false);
    const found: Record<string, string> = {};
    if (reportErrors(result, result.data?.saveCustomField.errors, ["name", "choices"] as const, (f, m) => { found[f] = m; }, setFormError)) return setErrors(found);
    const f = result.data!.saveCustomField.field!;
    onCreated({ id: `custom:${f.key}`, kind: "custom", key: f.key, label: f.name, fields: [] });
  }

  return (
    <Dialog open onClose={onClose} title="New custom field" description="Added to every employee's record."
      footer={<><Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button><Button type="submit" form="new-field" busy={busy}>Add field</Button></>}>
      <form id="new-field" onSubmit={submit} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <Field label="Name" error={errors.name}><Input value={name} aria-invalid={!!errors.name} placeholder="T-shirt size" onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Type"><Select value={type} onChange={(e) => setType(e.target.value as CustomFieldType)}>{TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></Field>
        {type === "CHOICE" && (
          <Field label="Choices" hint="One per line." error={errors.choices}>
            <textarea rows={3} value={choices} onChange={(e) => setChoices(e.target.value)}
              className="block w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink shadow-sm outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15" />
          </Field>
        )}
        <Checkbox label="HR only" description="Hidden from managers and the employee." checked={hrOnly} onChange={setHrOnly} />
      </form>
    </Dialog>
  );
}

function NewTableDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (item: LayoutItem) => void }) {
  const [, save] = useMutation(SaveTableDocument);
  const [name, setName] = useState("");
  const [columns, setColumns] = useState<{ name: string; type: CustomFieldType; choices: string }[]>([{ name: "", type: "TEXT", choices: "" }]);
  const [hrOnly, setHrOnly] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const setColumn = (i: number, patch: Partial<(typeof columns)[number]>) => setColumns(columns.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    if (!name.trim()) return setFormError("Enter a name for the table.");
    const cols = columns.filter((c) => c.name.trim());
    if (!cols.length) return setFormError("Add at least one column.");
    setBusy(true);
    const result = await save({ input: { name: name.trim(), hrOnly, columns: cols.map((c) => ({
      name: c.name.trim(), type: c.type, choices: c.choices.split(",").map((x) => x.trim()).filter(Boolean),
    })) } });
    setBusy(false);
    if (reportErrors(result, result.data?.saveCustomTable.errors, [] as const, () => {}, setFormError)) return;
    const t = result.data!.saveCustomTable.table!;
    onCreated({ id: `table:${t.key}`, kind: "table", key: t.key, label: t.name, fields: [] });
  }

  return (
    <Dialog open wide onClose={onClose} title="New custom table" description="A list each employee can have several entries in, such as certifications, assets or bonuses."
      footer={<><Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button><Button type="submit" form="new-table" busy={busy}>Add table</Button></>}>
      <form id="new-table" onSubmit={submit} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <Field label="Table name"><Input value={name} placeholder="Certifications" onChange={(e) => setName(e.target.value)} /></Field>
        <div className="space-y-2">
          <span className="block text-[13px] font-medium text-ink">Columns</span>
          {columns.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_150px_auto] items-start gap-2">
              <Input aria-label="Column name" value={c.name} placeholder={i === 0 ? "Name" : "Column"} onChange={(e) => setColumn(i, { name: e.target.value })} />
              <Select aria-label="Column type" value={c.type} onChange={(e) => setColumn(i, { type: e.target.value as CustomFieldType })}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
              <IconButton type="button" label="Remove column" onClick={() => setColumns(columns.filter((_, j) => j !== i))} disabled={columns.length === 1}><IconClose size={14} /></IconButton>
              {c.type === "CHOICE" && (
                <Input className="col-span-2" aria-label="Choices" value={c.choices} placeholder="Choices, separated by commas" onChange={(e) => setColumn(i, { choices: e.target.value })} />
              )}
            </div>
          ))}
          <Button type="button" size="sm" variant="ghost" icon={<IconPlus size={14} />} onClick={() => setColumns([...columns, { name: "", type: "TEXT", choices: "" }])} disabled={columns.length >= 12}>
            Add column
          </Button>
        </div>
        <Checkbox label="HR only" description="Hidden from managers and the employee." checked={hrOnly} onChange={setHrOnly} />
      </form>
    </Dialog>
  );
}

/* --------------------------------------------------------------- Tab layout */

/** Arrange the sections and fields of one tab. Changes apply to every employee's record. */
export function CustomizeLayout({ layout, tables, fields, tabKey, onClose, onSaved }: {
  layout: Layout; tables: CustomTable[]; fields: CustomFieldRef[]; tabKey: string; onClose: () => void; onSaved: () => void;
}) {
  const fieldId = (item: LayoutItem) => fields.find((f) => f.key === item.key)?.id ?? null;
  const [tabs, setTabs] = useState<Tab[]>(() => toWorking(layout));
  const [labels, setLabels] = useState<Record<string, LayoutItem>>(() => Object.fromEntries(
    [...layout.tabs.flatMap((t) => t.sections.flatMap((s) => s.items)), ...layout.library].map((i) => [i.id, i])));
  const [drag, setDrag] = useState<{ section: string; index: number } | null>(null);
  const [adding, setAdding] = useState<string | null>(null); // the section the Add menu is open for
  const [creating, setCreating] = useState<{ kind: "field" | "table"; section: string } | null>(null);
  const [, saveField] = useMutation(SaveFieldDocument);
  const [, saveTable] = useMutation(SaveTableDocument);
  const { run, error, busy } = useSaveLayout(onSaved);

  const tab = tabs.find((t) => t.key === tabKey)!;
  const placed = new Set(tabs.flatMap((t) => t.sections.flatMap((s) => s.items)));
  const library = Object.values(labels).filter((i) => !placed.has(i.id) && i.kind !== "block");
  const archived = new Set(layout.library.filter((i) => i.kind === "custom" || i.kind === "table").map((i) => i.id));
  const allSections = tabs.flatMap((t) => t.sections.map((s) => ({ tab: t, section: s })));

  const update = (fn: (tabs: Tab[]) => void) => setTabs((current) => {
    const next: Tab[] = JSON.parse(JSON.stringify(current));
    fn(next);
    return next;
  });
  const sectionOf = (all: Tab[], key: string) => all.flatMap((t) => t.sections).find((s) => s.key === key)!;

  function move(from: { section: string; index: number }, toSection: string, toIndex: number) {
    update((all) => {
      const src = sectionOf(all, from.section);
      const [item] = src.items.splice(from.index, 1);
      const dst = sectionOf(all, toSection);
      dst.items.splice(Math.min(toIndex, dst.items.length), 0, item);
    });
  }

  function onDrop(e: DragEvent, section: string, index: number) {
    e.preventDefault();
    if (drag) move(drag, section, drag.section === section && drag.index < index ? index - 1 : index);
    setDrag(null);
  }

  async function addItem(item: LayoutItem, section: string) {
    // Archived custom fields and tables come back to life before they are placed.
    if (archived.has(item.id)) {
      const result = item.kind === "custom"
        ? await saveField({ input: { id: fieldId(item), isActive: true } })
        : await saveTable({ input: { id: tables.find((t) => t.key === item.key)?.id ?? null, isActive: true } });
      if (result.error) return;
    }
    update((all) => { sectionOf(all, section).items.push(item.id); });
    setAdding(null);
  }

  async function archive(item: LayoutItem, section: string) {
    const result = item.kind === "custom"
      ? await saveField({ input: { id: fieldId(item), isActive: false } })
      : await saveTable({ input: { id: tables.find((t) => t.key === item.key)?.id ?? null, isActive: false } });
    if (result.error) return;
    update((all) => { const s = sectionOf(all, section); s.items = s.items.filter((i) => i !== item.id); });
  }

  return (
    <Dialog open wide onClose={onClose} title={`Customize ${tab.name}`}
      description="Drag to reorder. Changes apply to every employee's record."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={() => run(tabs)} busy={busy}>Save layout</Button>
      </>}>
      <div className="space-y-5 pb-2">
        {error && <ErrorNote error={error} />}
        {tab.sections.map((section) => {
          const hasBlock = section.items.some((i) => i.startsWith("block:"));
          const Icon = SECTION_ICONS[section.icon];
          return (
            <div key={section.key} className="rounded-xl border border-line bg-subtle/40 p-3"
              onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, section.key, section.items.length)}>
              <div className="mb-2 flex items-center gap-2">
                <div className="relative">
                  <select aria-label="Section icon" value={section.icon}
                    onChange={(e) => update((all) => { sectionOf(all, section.key).icon = e.target.value; })}
                    className="absolute inset-0 cursor-pointer opacity-0">
                    {Object.keys(SECTION_ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface text-brand-ink ring-1 ring-line">{Icon && <Icon size={16} />}</span>
                </div>
                <Input aria-label="Section title" value={section.title} className="font-semibold"
                  onChange={(e) => update((all) => { sectionOf(all, section.key).title = e.target.value; })} />
                <IconButton label={hasBlock ? "Move the built-in part out first" : "Remove section"} disabled={hasBlock}
                  onClick={() => update((all) => { const t = all.find((x) => x.key === tabKey)!; t.sections = t.sections.filter((s) => s.key !== section.key); })}>
                  <IconClose size={14} />
                </IconButton>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((id, index) => {
                  const item = labels[id];
                  return (
                    <li key={id} draggable onDragStart={() => setDrag({ section: section.key, index })} onDragEnd={() => setDrag(null)}
                      onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.stopPropagation(); onDrop(e, section.key, index); }}
                      className={cx("flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-2 text-sm shadow-sm",
                        drag?.section === section.key && drag.index === index && "opacity-50")}>
                      <IconGrip size={16} className="flex-none cursor-grab text-muted" />
                      <span className="min-w-0 flex-1 truncate font-medium text-ink">{item?.label ?? id}</span>
                      <Badge>{KIND_LABEL[item?.kind ?? "field"]}</Badge>
                      <select aria-label={`Move ${item?.label ?? id} to another section`} value=""
                        onChange={(e) => e.target.value && move({ section: section.key, index }, e.target.value, Infinity)}
                        className="w-24 rounded-md border border-line bg-surface px-1.5 py-1 text-xs text-muted">
                        <option value="">Move to…</option>
                        {allSections.filter((x) => x.section.key !== section.key).map((x) => (
                          <option key={x.section.key} value={x.section.key}>{x.tab.name}: {x.section.title}</option>
                        ))}
                      </select>
                      {item?.kind === "field" || item?.kind === "group" ? (
                        <IconButton label="Take off the record" className="h-7 w-7"
                          onClick={() => update((all) => { sectionOf(all, section.key).items.splice(index, 1); })}><IconClose size={13} /></IconButton>
                      ) : item?.kind === "custom" || item?.kind === "table" ? (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => void archive(item, section.key)}>Archive</Button>
                      ) : <span className="w-7" />}
                    </li>
                  );
                })}
                {!section.items.length && <li className="rounded-lg border border-dashed border-line-strong px-3 py-3 text-center text-xs text-muted">Drop items here</li>}
              </ul>
              <div className="relative mt-2">
                <Button size="sm" variant="ghost" icon={<IconPlus size={14} />} onClick={() => setAdding(adding === section.key ? null : section.key)}>
                  Add <IconChevronDown size={13} />
                </Button>
                {adding === section.key && (
                  <div className="absolute left-0 top-full z-10 mt-1 max-h-72 w-72 overflow-y-auto rounded-xl border border-line bg-surface py-1 shadow-lg">
                    {library.length > 0 && <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Not on the record</div>}
                    {library.map((i) => (
                      <button key={i.id} type="button" onClick={() => void addItem(i, section.key)}
                        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-subtle">
                        <span className="truncate">{i.label}</span>
                        {archived.has(i.id) && <span className="text-xs text-muted">Restore</span>}
                      </button>
                    ))}
                    <div className="mt-1 border-t border-line pt-1">
                      <button type="button" className="block w-full px-3 py-2 text-left text-sm font-medium text-brand-ink hover:bg-subtle"
                        onClick={() => { setCreating({ kind: "field", section: section.key }); setAdding(null); }}>New custom field…</button>
                      <button type="button" className="block w-full px-3 py-2 text-left text-sm font-medium text-brand-ink hover:bg-subtle"
                        onClick={() => { setCreating({ kind: "table", section: section.key }); setAdding(null); }}>New custom table…</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <Button variant="secondary" icon={<IconPlus size={15} />} onClick={() => update((all) => {
          all.find((t) => t.key === tabKey)!.sections.push({ key: `s_${newKey()}`, title: "New section", icon: "list", items: [] });
        })}>Add section</Button>
      </div>
      {creating && (creating.kind === "field" ? (
        <NewFieldDialog onClose={() => setCreating(null)} onCreated={(item) => {
          setLabels((l) => ({ ...l, [item.id]: item }));
          update((all) => { sectionOf(all, creating.section).items.push(item.id); });
          setCreating(null);
        }} />
      ) : (
        <NewTableDialog onClose={() => setCreating(null)} onCreated={(item) => {
          setLabels((l) => ({ ...l, [item.id]: item }));
          update((all) => { sectionOf(all, creating.section).items.push(item.id); });
          setCreating(null);
        }} />
      ))}
    </Dialog>
  );
}

/* --------------------------------------------------------------------- Tabs */

/** Reorder, rename, add and remove the record's tabs. Built-in tabs can move but not go. */
export function CustomizeTabs({ layout, onClose, onSaved }: { layout: Layout; onClose: () => void; onSaved: () => void }) {
  const [tabs, setTabs] = useState<Tab[]>(() => toWorking(layout));
  const [drag, setDrag] = useState<number | null>(null);
  const { run, error, busy } = useSaveLayout(onSaved);
  const setName = (i: number, name: string) => setTabs(tabs.map((t, j) => (j === i ? { ...t, name } : t)));

  return (
    <Dialog open wide onClose={onClose} title="Customize tabs" description="Drag to reorder. Built-in tabs can be renamed and moved; your own can also be removed."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={() => run(tabs)} busy={busy}>Save tabs</Button>
      </>}>
      <div className="space-y-2 pb-2">
        {error && <ErrorNote error={error} />}
        {tabs.map((t, i) => {
          const hasBlock = t.sections.some((s) => s.items.some((x) => x.startsWith("block:")));
          return (
            <div key={t.key} draggable onDragStart={() => setDrag(i)} onDragEnd={() => setDrag(null)} onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (drag === null || drag === i) return;
                const next = [...tabs];
                const [moved] = next.splice(drag, 1);
                next.splice(i, 0, moved);
                setTabs(next);
                setDrag(null);
              }}
              className={cx("flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-2 shadow-sm", drag === i && "opacity-50")}>
              <IconGrip size={16} className="flex-none cursor-grab text-muted" />
              <Input aria-label="Tab name" value={t.name} maxLength={30} onChange={(e) => setName(i, e.target.value)} />
              {t.builtin ? <Badge>Built-in</Badge> : (
                <IconButton label={hasBlock ? "Move the built-in parts to another tab first" : "Remove tab"} disabled={hasBlock}
                  onClick={() => setTabs(tabs.filter((_, j) => j !== i))}><IconClose size={14} /></IconButton>
              )}
            </div>
          );
        })}
        <Button variant="secondary" icon={<IconPlus size={15} />} onClick={() => setTabs([...tabs, {
          key: `tab_${newKey()}`, name: "New tab", builtin: false, sections: [{ key: `s_${newKey()}`, title: "Details", icon: "list", items: [] }],
        }])}>Add tab</Button>
        <p className="pt-2 text-xs text-muted">Fields on a removed tab go back to the list you can add from. Archived custom fields stay archived.</p>
      </div>
    </Dialog>
  );
}
