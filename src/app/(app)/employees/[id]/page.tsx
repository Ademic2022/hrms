"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useMutation, useQuery } from "urql";

import {
  ChangeJobDialog, ChangePayDialog, ChangeStatusDialog, EditPersonalDialog, canChangeStatus,
} from "@/components/employees/EmployeeDialogs";
import { AdjustBalanceDialog, EmployeeLeaveDocument, RequestsTable, TypeDot } from "@/components/leave/Leave";
import { ActionDialog, Avatar, Badge, Button, Card, ErrorNote, Loading, Notice, PageHeader, RowLink, StatusBadge } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { formatDate, formatDays, formatFrequency, formatMoney, humanize } from "@/lib/format";
import { today } from "@/lib/forms";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

const ArchiveDocument = graphql(`
  mutation ArchiveEmployee($id: ID!) {
    archiveEmployee(id: $id) {
      employee { id }
      errors { field message }
    }
  }
`);

type Open = "personal" | "job" | "pay" | "status" | "archive" | "adjust" | null;

const EmployeeDocument = graphql(`
  query Employee($id: ID!) {
    employee(id: $id) {
      id
      employeeNumber
      fullName
      firstName
      middleName
      lastName
      preferredName
      workEmail
      personalEmail
      phone
      dateOfBirth
      gender
      status
      hireDate
      probationEndDate
      terminationDate
      terminationReason
      employmentType
      archivedAt
      legalEntity { id name }
      department { id name }
      location { id name }
      jobTitle { id name }
      grade { id name }
      manager { id fullName }
      directReports { id fullName jobTitle { name } }
      compensation { amount currency frequency effectiveDate }
      compensationHistory { id amount currency frequency effectiveDate reason }
      employmentHistory {
        id
        effectiveDate
        changeType
        reason
        jobTitle { name }
        department { name }
        grade { name }
        manager { fullName }
      }
    }
  }
`);

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm text-ink">{children || <span className="text-muted">—</span>}</dd>
    </div>
  );
}

export default function EmployeePage() {
  const { id } = useParams<{ id: string }>();
  const { can, tenant, me } = useSession();
  const [{ data, error }, reload] = useQuery({ query: EmployeeDocument, variables: { id } });
  const [, archive] = useMutation(ArchiveDocument);
  // Leave shows to the person, their managers up the line and HR; for anyone else the API says not found.
  const [{ data: leaveData }, reloadLeave] = useQuery({ query: EmployeeLeaveDocument, variables: { employeeId: id } });
  const [open, setOpen] = useState<Open>(null);
  const [saved, setSaved] = useState<string>();

  if (error) return <ErrorNote error={errorMessage(error)} />;
  if (!data) return <Loading />;
  const e = data.employee;
  if (!e) return <ErrorNote error="This employee could not be found." />;

  const manage = can(PERMS.employeesManage);
  const left = e.status === "TERMINATED";
  function done(message: string) {
    setOpen(null);
    setSaved(message);
    reload({ requestPolicy: "network-only" });
    reloadLeave({ requestPolicy: "network-only" });
  }
  const leave = leaveData?.employeeLeave;
  const self = me?.employee?.id === e.id;
  const dialogProps = { employee: e, onClose: () => setOpen(null) };

  return (
    <>
      <PageHeader
        back={{ href: "/employees", label: "Employees" }}
        title={e.fullName}
        subtitle={
          <>
            <StatusBadge status={e.status} />
            <span>{[e.jobTitle?.name, e.department?.name].filter(Boolean).join(" · ")}</span>
            <span className="tabular-nums">{e.employeeNumber}</span>
          </>
        }
        actions={manage ? (
          <>
            {!left && <Button variant="secondary" onClick={() => setOpen("job")}>Change job</Button>}
            {canChangeStatus(e.status) && <Button variant="secondary" onClick={() => setOpen("status")}>Change status</Button>}
            {left && !e.archivedAt && <Button variant="secondary" onClick={() => setOpen("archive")}>Archive</Button>}
          </>
        ) : <Avatar name={e.fullName} size="lg" />}
      />
      {e.archivedAt && <Notice tone="info" title="Archived">This record is hidden from the employee list but kept for reporting and audit.</Notice>}
      {saved && <Notice tone="success">{saved}</Notice>}

      {open === "personal" && <EditPersonalDialog {...dialogProps} onSaved={() => done("Personal details saved.")} />}
      {open === "job" && <ChangeJobDialog {...dialogProps} onSaved={() => done("Job change recorded.")} />}
      {open === "pay" && <ChangePayDialog {...dialogProps} currency={tenant?.currency ?? ""} onSaved={() => done("Pay change recorded.")} />}
      {open === "status" && <ChangeStatusDialog {...dialogProps} onSaved={() => done("Status updated.")} />}
      {open === "adjust" && leave && (
        <AdjustBalanceDialog employeeId={e.id} employeeName={e.fullName} balances={leave.balances}
          onClose={() => setOpen(null)} onSaved={() => done("Leave balance adjusted.")} />
      )}
      <ActionDialog open={open === "archive"} onClose={() => setOpen(null)} title={`Archive ${e.fullName}?`}
        description="The record leaves the employee list. History, pay and audit entries are kept." confirmLabel="Archive"
        onConfirm={async () => {
          const result = await archive({ id: e.id });
          const problem = errorMessage(result.error) ?? result.data?.archiveEmployee.errors[0]?.message;
          if (problem) throw new Error(problem);
          done("Employee archived.");
        }} />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <Card title="Job">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Detail label="Job title">{e.jobTitle?.name}</Detail>
              <Detail label="Grade">{e.grade?.name}</Detail>
              <Detail label="Employment type">{humanize(e.employmentType)}</Detail>
              <Detail label="Department">{e.department?.name}</Detail>
              <Detail label="Location">{e.location?.name}</Detail>
              <Detail label="Legal entity">{e.legalEntity.name}</Detail>
              <Detail label="Manager">
                {e.manager ? <Link className="font-medium text-brand-ink hover:underline" href={`/employees/${e.manager.id}`}>{e.manager.fullName}</Link> : null}
              </Detail>
              <Detail label="Started">{formatDate(e.hireDate)}</Detail>
              {e.probationEndDate ? <Detail label="Probation ends">{formatDate(e.probationEndDate)}</Detail> : null}
              {e.terminationDate ? <Detail label="Left on">{formatDate(e.terminationDate)}</Detail> : null}
              {e.terminationReason ? <Detail label="Reason for leaving">{e.terminationReason}</Detail> : null}
            </dl>
          </Card>

          <Card title="Personal" actions={manage ? <Button size="sm" variant="ghost" onClick={() => setOpen("personal")}>Edit</Button> : undefined}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Detail label="Legal name">{[e.firstName, e.middleName, e.lastName].filter(Boolean).join(" ")}</Detail>
              <Detail label="Preferred name">{e.preferredName}</Detail>
              <Detail label="Gender">{e.gender ? humanize(e.gender) : null}</Detail>
              <Detail label="Work email">{e.workEmail}</Detail>
              <Detail label="Personal email">{e.personalEmail}</Detail>
              <Detail label="Phone">{e.phone}</Detail>
              <Detail label="Date of birth">{e.dateOfBirth ? formatDate(e.dateOfBirth) : null}</Detail>
            </dl>
          </Card>

          <Card title="Employment history" description="Every hire, promotion, transfer and change, newest first.">
            <ol className="relative space-y-5 before:absolute before:inset-y-1 before:left-[5px] before:w-px before:bg-line">
              {e.employmentHistory.map((h) => (
                <li key={h.id} className="relative pl-6">
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-surface bg-brand ring-1 ring-line" aria-hidden />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="text-sm font-medium text-ink">{humanize(h.changeType)}</p>
                    <span className="text-[13px] tabular-nums text-muted">{formatDate(h.effectiveDate)}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {[h.jobTitle?.name, h.grade?.name, h.department?.name, h.manager && `reports to ${h.manager.fullName}`]
                      .filter(Boolean).join(" · ")}
                  </p>
                  {h.reason ? <p className="mt-0.5 text-[13px] italic text-muted">“{h.reason}”</p> : null}
                </li>
              ))}
            </ol>
          </Card>

          {leave && leave.requests.length > 0 && !self ? (
            <Card title="Leave requests" flush>
              <RequestsTable requests={leave.requests.slice(0, 10)} showEmployee={e.fullName}
                onChanged={() => done("Leave cancelled.")} />
            </Card>
          ) : null}
        </div>

        <div className="space-y-5">
          {/* The API returns pay only to people allowed to see it; absent means hidden or not set. */}
          {e.compensation || (can(PERMS.compensationManage) && !left) ? (
            <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[13px] font-medium text-muted">Base pay</div>
                {can(PERMS.compensationManage) && !left && (
                  <Button size="sm" variant="ghost" className="-my-1 -mr-2" onClick={() => setOpen("pay")}>{e.compensation ? "Change" : "Add"}</Button>
                )}
              </div>
              {e.compensation ? (
                <>
                  <div className="mt-2 font-display text-[28px] font-medium leading-none tracking-[-0.01em] text-ink tabular-nums">
                    {formatMoney(e.compensation.amount, e.compensation.currency)}
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    {formatFrequency(e.compensation.frequency)} · since {formatDate(e.compensation.effectiveDate)}
                  </div>
                </>
              ) : (
                <div className="mt-2 text-sm text-muted">No pay recorded yet.</div>
              )}
              {e.compensationHistory.length > 1 && (
                <ul className="mt-4 space-y-2 border-t border-line pt-3 text-[13px]">
                  {e.compensationHistory.map((c) => (
                    <li key={c.id} className="flex items-baseline justify-between gap-3">
                      <span className="text-muted">
                        {formatDate(c.effectiveDate)}
                        {c.reason && <span className="block text-xs">{c.reason}</span>}
                      </span>
                      <span className="flex items-center gap-2 tabular-nums text-ink">
                        {c.effectiveDate > today() && <Badge tone="warn">Upcoming</Badge>}
                        {formatMoney(c.amount, c.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {leave && (leave.balances.length > 0 || can(PERMS.leaveManage)) ? (
            <Card title="Leave" flush
              actions={can(PERMS.leaveManage) && leave.balances.some((b) => b.leaveType.tracksBalance) ? (
                <Button size="sm" variant="ghost" className="-my-1 -mr-2" onClick={() => setOpen("adjust")}>Adjust</Button>
              ) : self ? <Link href="/leave" className="text-sm font-medium text-brand-ink hover:underline">Open</Link> : undefined}>
              {leave.balances.length ? (
                <ul>
                  {leave.balances.map((b) => (
                    <li key={b.leaveType.id} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 text-sm last:border-b-0">
                      <span className="flex min-w-0 items-center gap-2"><TypeDot color={b.leaveType.color} /><span className="truncate">{b.leaveType.name}</span></span>
                      <span className="flex-none text-right tabular-nums">
                        {b.available != null ? formatDays(b.available) : <span className="text-muted">As needed</span>}
                        {Number(b.pending) > 0 && <span className="block text-xs text-muted">{formatDays(b.pending)} pending</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm text-muted">No leave policy covers this employee.</p>
              )}
            </Card>
          ) : null}

          {e.directReports.length ? (
            <Card title="Direct reports" description={`${e.directReports.length} ${e.directReports.length === 1 ? "person" : "people"}`} flush>
              {e.directReports.map((r) => (
                <RowLink key={r.id} href={`/employees/${r.id}`}
                  title={<span className="flex items-center gap-3"><Avatar name={r.fullName} />{r.fullName}</span>}
                  meta={r.jobTitle?.name ? <span className="pl-11">{r.jobTitle.name}</span> : undefined} />
              ))}
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
