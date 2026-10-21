"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "urql";

import { IconCheck, IconPlus } from "@/components/icons";
import { EmployeeLeaveDocument, LeaveStatusBadge, RequestLeaveDialog, TypeDot } from "@/components/leave/Leave";
import { Avatar, Button, ButtonLink, Card, Loading, Notice, PageHeader, RowLink, Stat } from "@/components/ui";
import { graphql } from "@/gql";
import { formatDays, formatRange } from "@/lib/format";
import { today } from "@/lib/forms";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

const HomeDocument = graphql(`
  query Home($start: Date!, $end: Date!, $year: Int!, $next: Int!) {
    leaveApprovals { id startDate endDate days employee { fullName } leaveType { name color } }
    leaveCalendar(start: $start, end: $end) {
      absences { requestId startDate endDate halfDay status employee { id fullName } leaveType { name color } }
    }
    thisYear: publicHolidays(year: $year) { id name date location { name } }
    nextYear: publicHolidays(year: $next) { id name date location { name } }
  }
`);

const StatsDocument = graphql(`
  query HomeStats {
    peopleStats { headcount joinersThisMonth leaversThisMonth onProbation awayToday pendingLeaveRequests }
  }
`);

const TeamDocument = graphql(`
  query HomeTeam($managerId: ID!) {
    directory(managerId: $managerId, first: 100) { nodes { id fullName jobTitle } }
  }
`);

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default function HomePage() {
  const { me, can } = useSession();
  const now = today();
  const weekEnd = addDays(now, 6);
  const year = new Date().getFullYear();
  const employeeId = me?.employee?.id;
  const seesStats = can(PERMS.employeesView);

  const [{ data }] = useQuery({ query: HomeDocument, variables: { start: now, end: weekEnd, year, next: year + 1 } });
  const [{ data: leaveData }, reloadLeave] = useQuery({ query: EmployeeLeaveDocument, variables: {}, pause: !employeeId });
  const [{ data: stats }] = useQuery({ query: StatsDocument, pause: !seesStats });
  const [{ data: team }] = useQuery({ query: TeamDocument, variables: { managerId: employeeId ?? "" }, pause: !employeeId });
  const [requesting, setRequesting] = useState(false);
  const [saved, setSaved] = useState<string>();

  if (!me || !data) return <Loading />;
  const leave = leaveData?.employeeLeave;
  const mine = (leave?.requests ?? [])
    .filter((r) => (r.status === "APPROVED" || r.status === "PENDING") && r.endDate >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);
  const away = data.leaveCalendar.absences.filter((a) => a.employee.id !== employeeId);
  const holidays = [...data.thisYear, ...data.nextYear].filter((h) => h.date >= now).slice(0, 4);
  const reports = team?.directory.nodes ?? [];
  const firstName = me.user.fullName.split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        title={`${greeting()}, ${firstName}`}
        actions={leave?.balances.length ? (
          <Button icon={<IconPlus size={16} />} onClick={() => { setSaved(undefined); setRequesting(true); }}>Request time off</Button>
        ) : null}
      />
      {saved && <Notice tone="success">{saved}</Notice>}

      {stats && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="People" value={stats.peopleStats.headcount}
            hint={stats.peopleStats.onProbation ? `${stats.peopleStats.onProbation} on probation` : undefined} />
          <Stat label="Joined this month" value={stats.peopleStats.joinersThisMonth}
            hint={stats.peopleStats.leaversThisMonth ? `${stats.peopleStats.leaversThisMonth} left` : "No leavers"} />
          <Stat label="Away today" value={stats.peopleStats.awayToday} />
          <Stat label="Leave requests pending" value={stats.peopleStats.pendingLeaveRequests} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-5">
          {data.leaveApprovals.length > 0 && (
            <Card flush title="Waiting for you" description={`${data.leaveApprovals.length} leave ${data.leaveApprovals.length === 1 ? "request" : "requests"} to decide`}
              actions={<ButtonLink href="/leave/approvals" size="sm" variant="secondary">Open approvals</ButtonLink>}>
              {data.leaveApprovals.slice(0, 5).map((r) => (
                <RowLink key={r.id} href="/leave/approvals" title={r.employee.fullName}
                  meta={<span className="flex items-center gap-1.5"><TypeDot color={r.leaveType.color} className="h-2 w-2" />{r.leaveType.name} · {formatRange(r.startDate, r.endDate)}</span>}
                  right={<span className="tabular-nums text-muted">{formatDays(r.days)}</span>} />
              ))}
            </Card>
          )}

          {leave && leave.balances.length > 0 && (
            <Card title="Your leave" actions={<Link href="/leave" className="text-sm font-medium text-brand-ink hover:underline">All time off</Link>}>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {leave.balances.map((b) => (
                  <div key={b.leaveType.id} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm"><TypeDot color={b.leaveType.color} /><span className="truncate">{b.leaveType.name}</span></span>
                    <span className="flex-none text-right text-sm tabular-nums">
                      {b.available != null ? <><span className="font-semibold text-ink">{Number(b.available)}</span> <span className="text-muted">days left</span></> : <span className="text-muted">As needed</span>}
                    </span>
                  </div>
                ))}
              </div>
              {mine.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {mine.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2"><TypeDot color={r.leaveType.color} />{formatRange(r.startDate, r.endDate)}</span>
                      <LeaveStatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          <Card flush title="Away this week" description={formatRange(now, weekEnd)}
            actions={<Link href="/leave/calendar" className="text-sm font-medium text-brand-ink hover:underline">Calendar</Link>}>
            {away.length ? (
              <ul className="divide-y divide-line">
                {away.map((a) => (
                  <li key={a.requestId} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar name={a.employee.fullName} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{a.employee.fullName}</span>
                        <span className="block text-xs text-muted">{a.leaveType?.name ?? "Away"}{a.halfDay ? ", half day" : ""}</span>
                      </span>
                    </span>
                    <span className="flex-none text-right text-[13px] tabular-nums text-muted">
                      {formatRange(a.startDate, a.endDate)}
                      {a.status === "PENDING" && <span className="block text-xs">Not yet approved</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-2 px-5 py-4 text-sm text-muted"><IconCheck size={16} />Everyone is in this week.</p>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Public holidays">
            {holidays.length ? (
              <ul className="space-y-3">
                {holidays.map((h) => (
                  <li key={h.id} className="flex items-center gap-3 text-sm">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-subtle text-center leading-none">
                      <span>
                        <span className="block text-[10px] font-semibold uppercase text-muted">{new Date(`${h.date}T00:00:00`).toLocaleDateString(undefined, { month: "short" })}</span>
                        <span className="block font-display text-base text-ink">{Number(h.date.slice(8))}</span>
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-ink">{h.name}</span>
                      <span className="block text-xs text-muted">
                        {new Date(`${h.date}T00:00:00`).toLocaleDateString(undefined, { weekday: "long" })}
                        {h.location && ` · ${h.location.name} only`}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">None coming up.</p>}
          </Card>

          {reports.length > 0 && (
            <Card flush title="Your team" description={`${reports.length} direct ${reports.length === 1 ? "report" : "reports"}`}>
              {reports.map((p) => (
                <RowLink key={p.id} href={`/employees/${p.id}`}
                  title={<span className="flex items-center gap-3"><Avatar name={p.fullName} />{p.fullName}</span>}
                  meta={p.jobTitle ? <span className="pl-11">{p.jobTitle}</span> : undefined} />
              ))}
            </Card>
          )}

          {!employeeId && (
            <Notice tone="info">Your account is not linked to an employee record, so there is no leave or team to show.</Notice>
          )}
        </div>
      </div>

      {requesting && leave && (
        <RequestLeaveDialog balances={leave.balances} onClose={() => setRequesting(false)}
          onSaved={(status) => {
            setRequesting(false);
            setSaved(status === "APPROVED" ? "Leave booked." : "Request sent to your manager.");
            reloadLeave({ requestPolicy: "network-only" });
          }} />
      )}
    </>
  );
}
