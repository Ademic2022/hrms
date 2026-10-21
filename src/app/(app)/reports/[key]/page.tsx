"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "urql";

import { IconDownload } from "@/components/icons";
import { ButtonLink, Card, Empty, ErrorNote, Field, Input, Loading, PageHeader, Select, Stat, Table, TD, TH } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { today } from "@/lib/forms";
import { ReportCatalogDocument } from "@/lib/reports";

const RunReportDocument = graphql(`
  query RunReport($key: String!, $params: ReportParams) {
    runReport(key: $key, params: $params) {
      title chart note start end rows
      columns { key label kind }
      summary { label value }
    }
  }
`);

const FilterOptionsDocument = graphql(`
  query ReportFilterOptions {
    legalEntities { id name isActive }
    locations { id name isActive }
    departments { id name isActive }
  }
`);

const GROUP_LABELS: Record<string, string> = {
  department: "Department", location: "Location", legal_entity: "Legal entity", grade: "Grade", employment_type: "Employment type",
};

type Cell = string | number | null;

function show(value: Cell, kind: string) {
  if (value === null || value === "") return "—";
  if (kind === "date") return formatDate(String(value));
  if (kind === "percent") return `${value}%`;
  if (kind === "money") return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (kind === "number") return Number(value).toLocaleString();
  return String(value);
}

export default function ReportPage() {
  const { key } = useParams<{ key: string }>();
  const [{ data: catalog }] = useQuery({ query: ReportCatalogDocument });
  const [{ data: options }] = useQuery({ query: FilterOptionsDocument });
  const info = catalog?.reportCatalog.find((r) => r.key === key);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState(today());
  const [groupBy, setGroupBy] = useState("department");
  const [entity, setEntity] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");

  const params = {
    start: info?.usesRange && start ? start : null, end: end || null, groupBy,
    legalEntityId: entity || null, locationId: location || null, departmentId: department || null,
  };
  const [{ data, error, fetching }] = useQuery({ query: RunReportDocument, variables: { key, params } });
  const result = data?.runReport;

  const query = new URLSearchParams(Object.entries({
    start: params.start ?? "", end: params.end ?? "", groupBy, legalEntity: entity, location, department,
  }).filter(([, v]) => v));
  const exportHref = (fmt: string) => `/api/reports/${key}/${fmt}/?${query}`;

  const chartIndex = result ? result.columns.findIndex((c) => c.key === result.chart) : -1;
  const rows = (result?.rows ?? []) as Cell[][];
  const max = chartIndex >= 0 ? Math.max(1, ...rows.map((r) => Number(r[chartIndex]) || 0)) : 1;
  const active = <T extends { isActive: boolean }>(xs: T[] | undefined) => (xs ?? []).filter((x) => x.isActive);

  return (
    <>
      <PageHeader back={{ href: "/reports", label: "Reports" }} title={info?.title ?? "Report"}
        subtitle={result ? result.title : info?.description}
        actions={result && (
          <>
            <ButtonLink href={exportHref("pdf")} download variant="secondary" icon={<IconDownload size={16} />}>PDF</ButtonLink>
            <ButtonLink href={exportHref("xlsx")} download variant="secondary">Excel</ButtonLink>
            <ButtonLink href={exportHref("csv")} download variant="ghost">CSV</ButtonLink>
          </>
        )} />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {info?.usesRange && (
            <Field label="From"><Input type="date" value={start || result?.start || ""} max={end} onChange={(e) => setStart(e.target.value)} /></Field>
          )}
          <Field label={info?.usesRange ? "To" : "As of"}><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
          {info && info.groupings.length > 0 && (
            <Field label="Group by">
              <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                {info.groupings.map((g) => <option key={g} value={g}>{GROUP_LABELS[g] ?? g}</option>)}
              </Select>
            </Field>
          )}
          <Field label="Legal entity">
            <Select value={entity} onChange={(e) => setEntity(e.target.value)}>
              <option value="">All</option>
              {active(options?.legalEntities).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </Select>
          </Field>
          <Field label="Location">
            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">All</option>
              {active(options?.locations).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </Select>
          </Field>
          <Field label="Department">
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All</option>
              {active(options?.departments).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </Select>
          </Field>
        </div>
      </Card>

      {error ? <ErrorNote error={errorMessage(error)} /> : !result ? <Loading /> : (
        <div className={fetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {result.summary.length > 0 && (
            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {result.summary.slice(0, 4).map((f) => <Stat key={f.label} label={f.label} value={f.value} />)}
            </div>
          )}
          {result.summary.length > 4 && (
            <p className="-mt-2 mb-5 text-sm text-muted">{result.summary.slice(4).map((f) => `${f.label}: ${f.value}`).join(" · ")}</p>
          )}
          <Card flush>
            {rows.length ? (
              <Table>
                <thead>
                  <tr>{result.columns.map((c) => <TH key={c.key} align={["number", "percent", "money"].includes(c.kind) ? "right" : "left"}>{c.label}</TH>)}</tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((value, j) => {
                        const column = result.columns[j];
                        const numeric = ["number", "percent", "money"].includes(column.kind);
                        return (
                          <TD key={j} align={numeric ? "right" : "left"} className={numeric ? "tabular-nums" : j === 0 ? "font-medium" : undefined}>
                            {j === chartIndex ? (
                              <span className="flex items-center justify-end gap-3">
                                <span className="hidden h-2 w-32 overflow-hidden rounded-full bg-subtle sm:block">
                                  <span className="block h-full rounded-full bg-brand" style={{ width: `${(Number(value) / max) * 100}%` }} />
                                </span>
                                {show(value, column.kind)}
                              </span>
                            ) : show(value, column.kind)}
                          </TD>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="p-5"><Empty title="Nothing to show">No one matches these filters in this period.</Empty></div>
            )}
          </Card>
          {result.note && <p className="mt-3 text-xs text-muted">{result.note}</p>}
        </div>
      )}
    </>
  );
}
