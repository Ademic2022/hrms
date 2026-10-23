"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "urql";

import { IconChevronDown, IconChevronRight, IconUsers } from "@/components/icons";
import { Avatar, Card, Empty, ErrorNote, Loading, PageHeader, SearchInput, Select, Tabs } from "@/components/ui";
import { graphql } from "@/gql";
import type { OrgChartQuery } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

const OrgChartDocument = graphql(`
  query OrgChart {
    orgChart { id fullName jobTitle departmentId department location workEmail managerId directReportCount }
  }
`);

type Person = OrgChartQuery["orgChart"][number];

function PersonCard({ p, href }: { p: Person; href?: string }) {
  const name = href ? <Link href={href} className="hover:underline">{p.fullName}</Link> : p.fullName;
  return (
    <div className="flex min-w-0 gap-3 rounded-xl border border-line bg-surface p-4 shadow-sm">
      <Avatar name={p.fullName} />
      <div className="min-w-0 text-sm">
        <div className="truncate font-semibold text-ink">{name}</div>
        <div className="truncate text-muted">{p.jobTitle ?? "No title"}</div>
        <div className="mt-1.5 truncate text-xs text-muted">{[p.department, p.location].filter(Boolean).join(" · ") || "—"}</div>
        {p.workEmail && <a href={`mailto:${p.workEmail}`} className="mt-0.5 block truncate text-xs font-medium text-brand-ink hover:underline">{p.workEmail}</a>}
      </div>
    </div>
  );
}

function TreeNode({ p, tree, depth, linkFor }: {
  p: Person; tree: Map<string, Person[]>; depth: number; linkFor: (p: Person) => string | undefined;
}) {
  const reports = tree.get(p.id) ?? [];
  const [open, setOpen] = useState(depth < 2);
  const href = linkFor(p);
  return (
    <li>
      <div className="flex items-center gap-2 py-1">
        {reports.length ? (
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} ${p.fullName}'s team`}
            className="grid h-6 w-6 flex-none place-items-center rounded text-muted hover:bg-subtle hover:text-ink">
            {open ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
          </button>
        ) : <span className="w-6 flex-none" />}
        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2 shadow-sm">
          <Avatar name={p.fullName} />
          <div className="min-w-0 text-sm">
            <div className="truncate font-medium text-ink">{href ? <Link href={href} className="hover:underline">{p.fullName}</Link> : p.fullName}</div>
            <div className="truncate text-xs text-muted">{[p.jobTitle, p.department].filter(Boolean).join(" · ")}</div>
          </div>
          {reports.length > 0 && <span className="ml-2 flex-none rounded-full bg-subtle px-2 text-xs text-muted tabular-nums">{reports.length}</span>}
        </div>
      </div>
      {open && reports.length > 0 && (
        <ul className="ml-3 border-l border-line pl-5">
          {reports.map((r) => <TreeNode key={r.id} p={r} tree={tree} depth={depth + 1} linkFor={linkFor} />)}
        </ul>
      )}
    </li>
  );
}

function Directory() {
  const { can } = useSession();
  const [{ data, error }] = useQuery({ query: OrgChartDocument });
  const params = useSearchParams();
  const [tab, setTab] = useState<"people" | "chart">(params.get("view") === "chart" ? "chart" : "people");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const query = useDeferredValue(search.trim().toLowerCase());
  // Full records need employees.view; everyone else gets the directory card only.
  const linkFor = (p: Person) => (can(PERMS.employeesView) ? `/employees/${p.id}` : undefined);

  const people = useMemo(() => data?.orgChart ?? [], [data]);
  const departments = useMemo(
    () => [...new Map(people.flatMap((p) => (p.departmentId && p.department ? [[p.departmentId, p.department] as const] : []))).entries()]
      .sort((a, b) => a[1].localeCompare(b[1])),
    [people],
  );
  const { roots, children } = useMemo(() => {
    const ids = new Set(people.map((p) => p.id));
    const children = new Map<string, Person[]>();
    const roots: Person[] = [];
    for (const p of people) {
      // Someone whose manager has left (or is not listed) starts a tree of their own.
      if (p.managerId && ids.has(p.managerId)) children.set(p.managerId, [...(children.get(p.managerId) ?? []), p]);
      else roots.push(p);
    }
    return { roots: roots.sort((a, b) => b.directReportCount - a.directReportCount), children };
  }, [people]);

  if (error) return <ErrorNote error={errorMessage(error)} />;
  if (!data) return <Loading />;

  const shown = people.filter((p) =>
    (!department || p.departmentId === department)
    && (!query || [p.fullName, p.jobTitle, p.department].some((v) => v?.toLowerCase().includes(query))));

  return (
    <>
      <PageHeader title="Directory" subtitle={`${people.length} ${people.length === 1 ? "person" : "people"} at work here`} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: "people", label: "People" }, { key: "chart", label: "Org chart" }]} />

      {tab === "people" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
            <SearchInput placeholder="Search by name, job title or department" aria-label="Search the directory"
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={department} aria-label="Department" onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All departments</option>
              {departments.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </Select>
          </div>
          {shown.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p) => <PersonCard key={p.id} p={p} href={linkFor(p)} />)}
            </div>
          ) : (
            <Empty title="No one matches" icon={<IconUsers size={18} />}>Try a different name or clear the department.</Empty>
          )}
        </>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <ul className="min-w-max space-y-1">
              {roots.map((p) => <TreeNode key={p.id} p={p} tree={children} depth={0} linkFor={linkFor} />)}
            </ul>
          </div>
        </Card>
      )}
    </>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Directory />
    </Suspense>
  );
}
