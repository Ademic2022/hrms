"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useState } from "react";
import { useQuery } from "urql";

import { IconPlus, IconUsers } from "@/components/icons";
import {
  Avatar, ButtonLink, Card, CursorPager, Empty, ErrorNote, Loading, PageHeader, SearchInput, Select, StatusBadge, Table, TD, TH,
} from "@/components/ui";
import { graphql } from "@/gql";
import type { EmployeeStatus } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

const EmployeesDocument = graphql(`
  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {
    employees(filter: $filter, first: $first, after: $after) {
      totalCount
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        employeeNumber
        fullName
        status
        hireDate
        jobTitle { name }
        department { name }
        location { name }
      }
    }
    departments { id name }
  }
`);

const STATUSES: { value: EmployeeStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PROBATION", label: "On probation" },
  { value: "ON_LEAVE", label: "On leave" },
  { value: "CANDIDATE", label: "Candidate" },
  { value: "TERMINATED", label: "Left" },
];
const PAGE = 25;

export default function EmployeesPage() {
  const { can } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EmployeeStatus | "">("");
  const [departmentId, setDepartmentId] = useState("");
  // The cursor each visited page started after; the last one is the page on screen.
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const after = cursors[cursors.length - 1];
  const query = useDeferredValue(search.trim());

  const filter = {
    search: query || null,
    statuses: status ? [status] : null,
    departmentId: departmentId || null,
  };
  const [{ data, fetching, error }] = useQuery({
    query: EmployeesDocument,
    variables: { filter, first: PAGE, after },
  });

  function resetPaging() {
    setCursors([null]);
  }

  const employees = data?.employees;

  const filtered = Boolean(query || status || departmentId);

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle={employees ? `${employees.totalCount.toLocaleString()} ${employees.totalCount === 1 ? "person" : "people"}` : undefined}
        actions={can(PERMS.employeesManage) ? <ButtonLink href="/employees/new" icon={<IconPlus size={16} />}>Add employee</ButtonLink> : null}
      />
      <Card flush>
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-[1fr_200px_200px]">
          <SearchInput placeholder="Search by name, number or email" aria-label="Search employees"
            value={search} onChange={(e) => { setSearch(e.target.value); resetPaging(); }} />
          <Select aria-label="Status" value={status}
            onChange={(e) => { setStatus(e.target.value as EmployeeStatus | ""); resetPaging(); }}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
          <Select aria-label="Department" value={departmentId}
            onChange={(e) => { setDepartmentId(e.target.value); resetPaging(); }}>
            <option value="">All departments</option>
            {data?.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </div>
        {error ? (
          <div className="p-4"><ErrorNote error={errorMessage(error)} /></div>
        ) : !employees ? (
          <div className="p-5"><Loading /></div>
        ) : !employees.nodes.length ? (
          <div className="p-5">
            <Empty title={filtered ? "No one matches" : "No employees yet"} icon={<IconUsers size={18} />}
              action={!filtered && can(PERMS.employeesManage) ? <ButtonLink href="/employees/new" size="sm">Add employee</ButtonLink> : undefined}>
              {filtered ? "Try a different name or clear the filters." : "Add your first employee to start building the directory."}
            </Empty>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TH>Employee</TH>
                <TH>Job</TH>
                <TH className="hidden md:table-cell">Location</TH>
                <TH className="hidden md:table-cell">Started</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {employees.nodes.map((e) => (
                <tr key={e.id} className="cursor-pointer transition hover:bg-subtle/60" onClick={() => router.push(`/employees/${e.id}`)}>
                  <TD>
                    <Link href={`/employees/${e.id}`} className="flex items-center gap-3 font-medium text-ink" onClick={(ev) => ev.stopPropagation()}>
                      <Avatar name={e.fullName} />
                      <span className="min-w-0">
                        <span className="block">{e.fullName}</span>
                        <span className="block text-xs font-normal tabular-nums text-muted">{e.employeeNumber}</span>
                      </span>
                    </Link>
                  </TD>
                  <TD>
                    <span className="block">{e.jobTitle?.name ?? <span className="text-muted">No title</span>}</span>
                    {e.department && <span className="block text-xs text-muted">{e.department.name}</span>}
                  </TD>
                  <TD className="hidden text-muted md:table-cell">{e.location?.name ?? "—"}</TD>
                  <TD className="hidden whitespace-nowrap tabular-nums text-muted md:table-cell">{formatDate(e.hireDate)}</TD>
                  <TD><StatusBadge status={e.status} /></TD>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {employees && (
          <CursorPager
            page={cursors.length}
            pageSize={PAGE}
            total={employees.totalCount}
            hasNext={employees.pageInfo.hasNextPage}
            busy={fetching}
            onPrevious={() => setCursors((c) => c.slice(0, -1))}
            onNext={() => setCursors((c) => [...c, employees.pageInfo.endCursor ?? null])}
          />
        )}
      </Card>
    </>
  );
}
