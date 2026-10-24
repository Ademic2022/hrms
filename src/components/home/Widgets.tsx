"use client";

import {
  faArrowTrendUp, faAward, faBoxOpen, faBullhorn, faCakeCandles, faCertificate, faChartColumn, faChartLine,
  faChevronLeft, faChevronRight, faClipboardCheck, faClock, faGraduationCap, faHandsClapping, faHeartPulse, faLink,
  faListCheck, faPen, faPlaneDeparture, faSitemap, faThumbtack, faTriangleExclamation, faUmbrellaBeach, faUserPen,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery } from "urql";

import { BarList, ColumnChart, LineChart, type Point } from "@/components/home/Charts";
import type { LeaveBalanceRow } from "@/components/leave/Leave";
import {
  ActionDialog, Avatar, Badge, Button, Checkbox, Dialog, ErrorNote, Field, IconButton, Input, Select, Textarea, cx,
} from "@/components/ui";
import { graphql } from "@/gql";
import type { HomeDataQuery } from "@/gql/graphql";
import { errorMessage } from "@/lib/api";
import { formatDate, formatDays, formatRange } from "@/lib/format";
import { reportErrors } from "@/lib/forms";

export const HomeDataDocument = graphql(`
  query HomeData {
    home {
      celebrations { kind date years person { id fullName jobTitle photoUrl } }
      newHires { hireDate person { id fullName jobTitle photoUrl } }
      myStuff { trainings certifications certificationsExpiring benefits openTasks }
      directReports { notes outToday person { id fullName jobTitle photoUrl } }
      insights {
        headcount { month value }
        leavers { month value }
        turnoverRate
        byLocation { label value }
        pendingUrgent pendingOther withoutPayRaise
        onboarding { inProgress withOverdue startingSoon }
      }
    }
    announcements(limit: 10) { id title body authorName publishedAt pinned }
    companyLinks { id group label url }
    homeLayout { key hidden }
  }
`);

export type HomeData = HomeDataQuery;
type Announcement = HomeData["announcements"][number];
type CompanyLink = HomeData["companyLinks"][number];
type Insights = NonNullable<HomeData["home"]["insights"]>;

/** "2026-10" -> "Oct" */
export const monthLabel = (month: string) =>
  new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1).toLocaleDateString(undefined, { month: "short" });
const toPoints = (rows: { month: string; value: string | number }[]): Point[] =>
  rows.map((r) => ({ label: monthLabel(r.month), value: Number(r.value) }));

/** A home widget: an icon, a serif title in the brand ink, optional actions, and the content. */
export function Widget({ title, icon, actions, children, className, flush }: {
  title: string; icon: IconDefinition; actions?: ReactNode; children: ReactNode; className?: string; flush?: boolean;
}) {
  return (
    <section className={cx("flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="flex min-w-0 items-center gap-2.5 font-display text-[19px] font-medium text-brand-ink">
          <FontAwesomeIcon icon={icon} className="text-[15px]" fixedWidth />
          <span className="truncate">{title}</span>
        </h2>
        {actions && <div className="flex flex-none items-center gap-2">{actions}</div>}
      </header>
      <div className={cx("flex-1", flush ? "" : "p-5")}>{children}</div>
    </section>
  );
}

const Empty = ({ children }: { children: ReactNode }) => <p className="text-sm text-muted">{children}</p>;

/* ------------------------------------------------------------------ Time off */

export function TimeOffWidget({ balances, onRequest }: { balances: LeaveBalanceRow[]; onRequest: () => void }) {
  const tracked = balances.filter((b) => b.available !== null && b.available !== undefined);
  const [index, setIndex] = useState(0);
  const current = tracked[index % Math.max(1, tracked.length)];
  return (
    <Widget title="Time off" icon={faUmbrellaBeach}>
      {current ? (
        <div className="flex items-center gap-2">
          <IconButton label="Previous leave type" onClick={() => setIndex((i) => (i - 1 + tracked.length) % tracked.length)} disabled={tracked.length < 2}>
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </IconButton>
          <div className="flex-1 text-center">
            <p className="text-sm text-muted">{current.leaveType.name}</p>
            <p className="mt-1 text-5xl font-semibold text-ink">{Number(current.available)}</p>
            <p className="text-sm text-muted">days available{Number(current.pending) ? ` · ${Number(current.pending)} pending` : ""}</p>
          </div>
          <IconButton label="Next leave type" onClick={() => setIndex((i) => (i + 1) % tracked.length)} disabled={tracked.length < 2}>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </IconButton>
        </div>
      ) : <Empty>No leave balance to show.</Empty>}
      <div className="mt-5 flex justify-center">
        <Button variant="secondary" icon={<FontAwesomeIcon icon={faUmbrellaBeach} className="text-[13px]" />} onClick={onRequest}>Request time off</Button>
      </div>
    </Widget>
  );
}

/* ------------------------------------------------------------------ My stuff */

function StuffRow({ href, icon, title, detail }: { href: string; icon: IconDefinition; title: string; detail: ReactNode }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-lg px-1 py-2.5 hover:bg-subtle">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-subtle text-brand-ink group-hover:bg-surface">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium text-ink">{title}</span>
        <span className="block text-xs text-muted">{detail}</span>
      </span>
    </Link>
  );
}

export function MyStuffWidget({ stuff, employeeId }: { stuff: NonNullable<HomeData["home"]["myStuff"]>; employeeId: string }) {
  const base = `/employees/${employeeId}?tab=`;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  return (
    <Widget title="My stuff" icon={faBoxOpen}>
      <div className="-my-1 divide-y divide-line">
        <StuffRow href={`${base}onboarding`} icon={faListCheck} title="My tasks"
          detail={stuff.openTasks ? `${plural(stuff.openTasks, "task")} to do` : "Nothing to do"} />
        <StuffRow href={`${base}training`} icon={faGraduationCap} title="Training" detail={stuff.trainings ? `${plural(stuff.trainings, "course")} completed` : "No training recorded"} />
        <StuffRow href={`${base}certifications`} icon={faCertificate} title="Certifications"
          detail={stuff.certificationsExpiring ? <span className="text-red-600">{plural(stuff.certificationsExpiring, "certification")} expiring soon</span>
            : stuff.certifications ? `${plural(stuff.certifications, "certification")}, none expiring soon` : "None recorded"} />
        <StuffRow href={`${base}benefits`} icon={faHeartPulse} title="Benefits"
          detail={stuff.benefits ? `You are enrolled in ${plural(stuff.benefits, "benefit plan")}` : "Not enrolled yet"} />
      </div>
    </Widget>
  );
}

/* ------------------------------------------------------------ What's happening */

const ApprovalsDocument = graphql(`
  query HomeApprovals {
    leaveApprovals { id startDate endDate days createdAt canDecide employee { id fullName } leaveType { name color } }
  }
`);

const ChangesDocument = graphql(`
  query HomeChanges {
    pendingChangeRequests { id employeeId employeeName createdAt canDecide }
  }
`);

const DecideDocument = graphql(`
  mutation HomeDecideLeave($input: DecideLeaveInput!) {
    decideLeave(input: $input) { request { id status } errors { field message } }
  }
`);

type FeedItem = { key: string; at: string; avatar?: string; icon?: IconDefinition; body: ReactNode; when: string; actions?: ReactNode };

function ago(iso: string) {
  const then = new Date(iso).getTime();
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days < 0) return days === -1 ? "Tomorrow" : `In ${-days} days`;
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(iso.slice(0, 10));
}

export function HappeningWidget({ announcements, newHires, canPost, canSeeChanges, onChanged, onOpen, onPost }: {
  announcements: Announcement[]; newHires: HomeData["home"]["newHires"]; canPost: boolean; canSeeChanges: boolean;
  onChanged: (message: string) => void; onOpen: (a: Announcement) => void; onPost: () => void;
}) {
  const [{ data: approvals }, reloadApprovals] = useQuery({ query: ApprovalsDocument });
  const [{ data: changes }] = useQuery({ query: ChangesDocument, pause: !canSeeChanges });
  const [, decide] = useMutation(DecideDocument);
  const [denying, setDenying] = useState<{ id: string; name: string } | null>(null);
  const [problem, setProblem] = useState<string>();

  async function approve(id: string) {
    const result = await decide({ input: { id, approve: true } });
    const message = errorMessage(result.error) ?? result.data?.decideLeave.errors[0]?.message;
    if (message) return setProblem(message);
    setProblem(undefined);
    reloadApprovals({ requestPolicy: "network-only" });
    onChanged("Leave approved.");
  }

  const items: FeedItem[] = [
    ...announcements.map((a): FeedItem => ({
      key: `a${a.id}`, at: a.publishedAt, icon: a.pinned ? faThumbtack : faBullhorn, when: ago(a.publishedAt),
      body: (
        <button type="button" onClick={() => onOpen(a)} className="text-left hover:underline">
          {a.authorName} posted an announcement <strong className="font-semibold">{a.title}</strong>
        </button>
      ),
    })),
    ...(approvals?.leaveApprovals ?? []).filter((r) => r.canDecide).map((r): FeedItem => ({
      key: `l${r.id}`, at: r.createdAt, when: ago(r.createdAt), avatar: r.employee.fullName,
      body: <>{r.employee.fullName} requested <strong className="font-semibold">{formatRange(r.startDate, r.endDate)}</strong> off – {formatDays(r.days)} of {r.leaveType.name}</>,
      actions: (
        <>
          <Button size="sm" variant="secondary" onClick={() => void approve(r.id)}>Approve</Button>
          <Button size="sm" variant="ghost" onClick={() => setDenying({ id: r.id, name: r.employee.fullName })}>Deny</Button>
        </>
      ),
    })),
    ...(changes?.pendingChangeRequests ?? []).filter((c) => c.canDecide).map((c): FeedItem => ({
      key: `c${c.id}`, at: c.createdAt, when: ago(c.createdAt), icon: faUserPen,
      body: <Link href="/employees/requests" className="hover:underline">{c.employeeName} is requesting an update to their personal information.</Link>,
    })),
    ...newHires.map((h): FeedItem => ({
      key: `h${h.person.id}`, at: `${h.hireDate}T08:00:00`, when: ago(`${h.hireDate}T08:00:00`), avatar: h.person.fullName,
      body: <Link href={`/employees/${h.person.id}`} className="hover:underline">{h.person.fullName} {new Date(`${h.hireDate}T00:00:00`) > new Date() ? "joins" : "joined"}{h.person.jobTitle ? ` as ${h.person.jobTitle}` : ""}.</Link>,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Widget title="What's happening" icon={faBullhorn} flush className="lg:col-span-2 lg:row-span-2"
      actions={canPost ? <Button size="sm" variant="ghost" onClick={onPost}>Post announcement</Button> : undefined}>
      {problem && <div className="px-5 pt-4"><ErrorNote error={problem} /></div>}
      {items.length ? (
        <ul className="max-h-[460px] divide-y divide-line overflow-y-auto">
          {items.map((i) => (
            <li key={i.key} className="flex gap-3 px-5 py-3.5">
              {i.avatar ? <Avatar name={i.avatar} /> : (
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-subtle text-muted"><FontAwesomeIcon icon={i.icon ?? faBullhorn} className="text-[13px]" /></span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-snug text-ink">{i.body}</p>
                <p className="mt-0.5 text-xs text-muted">{i.when}</p>
                {i.actions && <div className="mt-2 flex gap-2">{i.actions}</div>}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="px-5 py-5 text-sm text-muted">Nothing new right now.</p>}
      {denying && <DenyDialog {...denying} onClose={() => setDenying(null)}
        onDone={() => { setDenying(null); reloadApprovals({ requestPolicy: "network-only" }); onChanged("Leave declined."); }} />}
    </Widget>
  );
}

function DenyDialog({ id, name, onClose, onDone }: { id: string; name: string; onClose: () => void; onDone: () => void }) {
  const [, decide] = useMutation(DecideDocument);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!note.trim()) return setError(`Tell ${name.split(" ")[0]} why. They will see this note.`);
    setBusy(true);
    const result = await decide({ input: { id, approve: false, note } });
    setBusy(false);
    const message = errorMessage(result.error) ?? result.data?.decideLeave.errors[0]?.message;
    if (message) setError(message);
    else onDone();
  }
  return (
    <Dialog open onClose={onClose} title={`Decline ${name}'s request?`}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="deny-form" busy={busy}>Decline</Button>
      </>}>
      <form id="deny-form" onSubmit={submit} noValidate>
        <Field label="Reason" error={error}><Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      </form>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- Announcements */

const SaveAnnouncementDocument = graphql(`
  mutation SaveAnnouncement($input: AnnouncementInput!) {
    saveAnnouncement(input: $input) { announcement { id } errors { field message } }
  }
`);

const DeleteAnnouncementDocument = graphql(`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`);

export function AnnouncementDialog({ announcement, onClose, onSaved }: { announcement: Announcement | null; onClose: () => void; onSaved: (message: string) => void }) {
  const [, save] = useMutation(SaveAnnouncementDocument);
  const [v, setV] = useState({
    title: announcement?.title ?? "", body: announcement?.body ?? "", pinned: announcement?.pinned ?? false,
    publishAt: announcement && new Date(announcement.publishedAt) > new Date() ? announcement.publishedAt.slice(0, 16) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setBusy(true);
    const result = await save({ input: {
      id: announcement?.id ?? null, title: v.title, body: v.body, pinned: v.pinned,
      publishedAt: v.publishAt ? new Date(v.publishAt).toISOString() : null,
    } });
    setBusy(false);
    const found: Record<string, string> = {};
    const failed = reportErrors(result, result.data?.saveAnnouncement.errors, ["title", "body", "publishedAt"] as const,
      (f, m) => { found[f] = m; }, setFormError);
    setErrors(found);
    if (!failed) onSaved(announcement ? "Announcement updated." : v.publishAt ? "Announcement scheduled." : "Announcement posted.");
  }

  return (
    <Dialog open wide onClose={onClose} title={announcement ? "Edit announcement" : "Post an announcement"}
      description="Everyone sees it on their home page."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="announcement-form" busy={busy}>{announcement ? "Save" : v.publishAt ? "Schedule" : "Post"}</Button>
      </>}>
      <form id="announcement-form" onSubmit={submit} noValidate className="space-y-4">
        {formError && <ErrorNote error={formError} />}
        <Field label="Title" error={errors.title}><Input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
        <Field label="Message" error={errors.body}><Textarea rows={6} value={v.body} onChange={(e) => setV({ ...v, body: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Publish at" optional hint="Leave empty to post now." error={errors.publishedAt}>
            <Input type="datetime-local" value={v.publishAt} onChange={(e) => setV({ ...v, publishAt: e.target.value })} />
          </Field>
          <div className="pt-7"><Checkbox label="Pin to the top" checked={v.pinned} onChange={(c) => setV({ ...v, pinned: c })} /></div>
        </div>
      </form>
    </Dialog>
  );
}

export function ReadAnnouncementDialog({ announcement, canEdit, onClose, onEdit, onDeleted }: {
  announcement: Announcement; canEdit: boolean; onClose: () => void; onEdit: () => void; onDeleted: () => void;
}) {
  const [, remove] = useMutation(DeleteAnnouncementDocument);
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <Dialog open wide onClose={onClose} title={announcement.title}
        description={`${announcement.authorName} · ${new Date(announcement.publishedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`}
        footer={canEdit ? <>
          <Button variant="ghost" onClick={() => setConfirming(true)}>Delete</Button>
          <Button variant="secondary" icon={<FontAwesomeIcon icon={faPen} className="text-xs" />} onClick={onEdit}>Edit</Button>
        </> : <Button variant="secondary" onClick={onClose}>Close</Button>}>
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">{announcement.body}</p>
      </Dialog>
      <ActionDialog open={confirming} onClose={() => setConfirming(false)} title="Delete this announcement?" confirmLabel="Delete" tone="danger"
        description="It disappears from everyone's home page."
        onConfirm={async () => {
          const result = await remove({ id: announcement.id });
          if (result.error) throw new Error(errorMessage(result.error));
          onDeleted();
        }} />
    </>
  );
}

/* -------------------------------------------------------------- Direct reports */

export function DirectReportsWidget({ reports }: { reports: HomeData["home"]["directReports"] }) {
  return (
    <Widget title="My direct reports" icon={faSitemap} className="lg:col-span-3">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {reports.map((r) => (
          <li key={r.person.id} className="text-center">
            <Link href={`/employees/${r.person.id}`} className="group inline-block">
              <span className={cx("mx-auto block h-20 w-20 overflow-hidden rounded-2xl bg-subtle ring-1 ring-line", r.outToday && "opacity-50")}>
                {r.person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.person.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center font-display text-2xl text-muted">
                    {r.person.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                )}
              </span>
              <span className={cx("mt-2 block text-sm font-medium group-hover:underline", r.outToday ? "text-muted" : "text-ink")}>{r.person.fullName}</span>
            </Link>
            <span className="block text-xs text-muted">{r.person.jobTitle ?? ""}</span>
            {r.notes.slice(0, 2).map((n) => <span key={n} className="mt-1 block text-xs text-muted">{n}</span>)}
            {r.notes.length > 2 && <span className="mt-0.5 block text-xs text-brand-ink">+{r.notes.length - 2} more</span>}
          </li>
        ))}
      </ul>
    </Widget>
  );
}

/* ------------------------------------------------------------------- Insights */

export function InsightsWidget({ insights }: { insights: Insights }) {
  const [view, setView] = useState<"headcount" | "turnover" | "location">("headcount");
  const tabs = [
    { key: "headcount", label: "Headcount", icon: faChartLine },
    { key: "turnover", label: "Turnover", icon: faArrowTrendUp },
    { key: "location", label: "By location", icon: faChartColumn },
  ] as const;
  const latest = Number(insights.headcount[insights.headcount.length - 1]?.value ?? 0);
  const leavers = insights.leavers.reduce((sum, l) => sum + Number(l.value), 0);
  return (
    <Widget title="People" icon={faChartLine} className="lg:col-span-3">
      <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          {view === "headcount" && (
            <>
              <p className="mb-3 text-sm text-muted"><span className="text-2xl font-semibold text-ink">{latest}</span> people employed now</p>
              <LineChart points={toPoints(insights.headcount)} unit="people" caption="Headcount at each month end, last 12 months" />
            </>
          )}
          {view === "turnover" && (
            <>
              <p className="mb-3 text-sm text-muted">
                <span className="text-2xl font-semibold text-ink">{Number(insights.turnoverRate)}%</span> turnover · {leavers} {leavers === 1 ? "leaver" : "leavers"} in 12 months
              </p>
              <ColumnChart points={toPoints(insights.leavers)} unit="leavers" caption="Leavers per month, last 12 months" />
            </>
          )}
          {view === "location" && (insights.byLocation.length ? <BarList items={insights.byLocation} unit="people" /> : <Empty>No one placed at a location yet.</Empty>)}
        </div>
        <div role="tablist" className="flex gap-1 lg:flex-col">
          {tabs.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={view === t.key} onClick={() => setView(t.key)}
              className={cx("flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                view === t.key ? "bg-brand text-white" : "text-ink hover:bg-subtle")}>
              <FontAwesomeIcon icon={t.icon} fixedWidth className="text-[13px]" />{t.label}
            </button>
          ))}
        </div>
      </div>
    </Widget>
  );
}

/* --------------------------------------------------------------- Celebrations */

export function CelebrationsWidget({ celebrations }: { celebrations: HomeData["home"]["celebrations"] }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <Widget title="Celebrations" icon={faCakeCandles}>
      {celebrations.length ? (
        <ul className="space-y-3">
          {celebrations.slice(0, 6).map((c) => (
            <li key={c.kind + c.person.id} className="flex items-center gap-3">
              <Avatar name={c.person.fullName} src={c.person.photoUrl} />
              <div className="min-w-0 flex-1">
                <Link href={`/employees/${c.person.id}`} className="block truncate text-sm font-medium text-ink hover:underline">{c.person.fullName}</Link>
                <p className="text-xs text-muted">
                  {new Date(`${c.date}T00:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric" })} –{" "}
                  {c.kind === "birthday" ? "Happy birthday!" : `${c.years} ${c.years === 1 ? "year" : "years"} at the company`}
                </p>
              </div>
              <FontAwesomeIcon icon={c.kind === "birthday" ? faCakeCandles : faAward} className={cx("text-sm", c.date === today ? "text-brand-ink" : "text-muted")} />
            </li>
          ))}
        </ul>
      ) : <Empty>No birthdays or work anniversaries in the next 30 days.</Empty>}
    </Widget>
  );
}

/* ------------------------------------------------------------------ Who's out */

const WhosOutDocument = graphql(`
  query HomeWhosOut($day: Date!) {
    leaveCalendar(start: $day, end: $day) { absences { requestId status employee { id fullName } leaveType { name } } }
  }
`);

export function WhosOutWidget({ today }: { today: string }) {
  const [{ data }] = useQuery({ query: WhosOutDocument, variables: { day: today } });
  const out = (data?.leaveCalendar.absences ?? []).filter((a) => a.status === "APPROVED");
  return (
    <Widget title="Who's out" icon={faPlaneDeparture}
      actions={<Link href="/leave/calendar" className="text-sm font-medium text-brand-ink hover:underline">Full calendar</Link>}>
      <p className="font-semibold text-brand-ink">{out.length ? `${out.length} ${out.length === 1 ? "person is" : "people are"} out today` : "Everyone is in today"}</p>
      {out.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {out.slice(0, 6).map((a) => (
            <li key={a.requestId} className="flex items-center gap-3 text-sm">
              <Avatar name={a.employee.fullName} />
              <span className="min-w-0">
                <Link href={`/employees/${a.employee.id}`} className="block truncate font-medium text-ink hover:underline">{a.employee.fullName}</Link>
                <span className="block text-xs text-muted">{a.leaveType?.name ?? "Away"}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
}

/* ------------------------------------------------------------- Company links */

const SaveLinksDocument = graphql(`
  mutation SaveCompanyLinks($links: [CompanyLinkInput!]!) {
    saveCompanyLinks(links: $links) { links { id } errors { field message } }
  }
`);

export function CompanyLinksWidget({ links, canEdit, onSaved }: { links: CompanyLink[]; canEdit: boolean; onSaved: (m: string) => void }) {
  const [editing, setEditing] = useState(false);
  const groups = new Map<string, CompanyLink[]>();
  for (const l of links) groups.set(l.group || "Links", [...(groups.get(l.group || "Links") ?? []), l]);
  return (
    <Widget title="Company links" icon={faLink}
      actions={canEdit ? <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button> : undefined}>
      {links.length ? (
        <div className="space-y-4">
          {[...groups].map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-brand-ink">{group}</h3>
              <ul className="mt-1 space-y-1">
                {items.map((l) => (
                  <li key={l.id}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:underline">{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : <Empty>{canEdit ? "Add links people use often: the company website, HMO portal, PFA, IT help." : "No links yet."}</Empty>}
      {editing && <LinksDialog links={links} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); onSaved("Links saved."); }} />}
    </Widget>
  );
}

function LinksDialog({ links, onClose, onSaved }: { links: CompanyLink[]; onClose: () => void; onSaved: () => void }) {
  const [, save] = useMutation(SaveLinksDocument);
  const [rows, setRows] = useState(links.length ? links.map(({ group, label, url }) => ({ group, label, url })) : [{ group: "Company", label: "", url: "https://" }]);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setBusy(true);
    const result = await save({ links: rows.filter((r) => r.label.trim() || r.url.trim() !== "https://") });
    setBusy(false);
    const message = errorMessage(result.error) ?? result.data?.saveCompanyLinks.errors[0]?.message;
    if (message) setError(message);
    else onSaved();
  }

  return (
    <Dialog open wide onClose={onClose} title="Company links" description="Shown on everyone's home page, grouped by heading."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" form="links-form" busy={busy}>Save links</Button>
      </>}>
      <form id="links-form" onSubmit={submit} noValidate className="space-y-3">
        {error && <ErrorNote error={error} />}
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.3fr_2fr_auto] items-end gap-2">
            <Field label={i === 0 ? "Heading" : ""}><Input aria-label="Heading" value={r.group} placeholder="Benefits" onChange={(e) => set(i, { group: e.target.value })} /></Field>
            <Field label={i === 0 ? "Name" : ""}><Input aria-label="Name" value={r.label} placeholder="HMO portal" onChange={(e) => set(i, { label: e.target.value })} /></Field>
            <Field label={i === 0 ? "Address" : ""}><Input aria-label="Address" type="url" value={r.url} onChange={(e) => set(i, { url: e.target.value })} /></Field>
            <Button variant="ghost" size="sm" className="mb-1" onClick={() => setRows(rows.filter((_, j) => j !== i))}>Remove</Button>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={() => setRows([...rows, { group: rows[rows.length - 1]?.group ?? "", label: "", url: "https://" }])}>Add link</Button>
      </form>
    </Dialog>
  );
}

/* --------------------------------------------------------------------- Welcome */

export function WelcomeWidget({ hires, company }: { hires: HomeData["home"]["newHires"]; company: string }) {
  const now = new Date().toISOString().slice(0, 10);
  const started = hires.filter((h) => h.hireDate <= now);
  const coming = hires.filter((h) => h.hireDate > now);
  return (
    <Widget title={`Welcome to ${company}`} icon={faHandsClapping}>
      {hires.length ? (
        <div className="space-y-4">
          {started.length > 0 && <p className="text-center font-display text-lg text-ink">Welcome {started.length} new team {started.length === 1 ? "member" : "members"}!</p>}
          <ul className="space-y-2.5">
            {hires.slice(0, 5).map((h) => (
              <li key={h.person.id} className="flex items-center gap-3">
                <Avatar name={h.person.fullName} src={h.person.photoUrl} />
                <span className="min-w-0">
                  <Link href={`/employees/${h.person.id}`} className="block truncate text-sm font-medium text-ink hover:underline">{h.person.fullName}</Link>
                  <span className="block text-xs text-muted">{h.hireDate > now ? "Starts" : "Started"} {formatDate(h.hireDate)}{h.person.jobTitle ? ` · ${h.person.jobTitle}` : ""}</span>
                </span>
              </li>
            ))}
          </ul>
          {coming.length > 0 && started.length > 0 && <p className="text-xs text-muted">{coming.length} more starting soon.</p>}
        </div>
      ) : <Empty>No one new in the last 30 days.</Empty>}
    </Widget>
  );
}

/* -------------------------------------------------------------- Time off used */

const TimeOffUsedDocument = graphql(`
  query HomeTimeOffUsed($leaveTypeId: ID!) {
    timeOffUsed(leaveTypeId: $leaveTypeId) { month value }
  }
`);

const LeaveTypesDocument = graphql(`
  query HomeLeaveTypes {
    leaveTypes { id name }
  }
`);

export function TimeOffUsedWidget() {
  const [{ data: types }] = useQuery({ query: LeaveTypesDocument });
  const [chosen, setChosen] = useState<string>();
  const typeId = chosen ?? types?.leaveTypes[0]?.id;
  const [{ data }] = useQuery({ query: TimeOffUsedDocument, variables: { leaveTypeId: typeId ?? "" }, pause: !typeId });
  return (
    <Widget title="Time off used" icon={faChartColumn}>
      {types && types.leaveTypes.length > 0 && (
        <Select aria-label="Leave type" value={typeId} onChange={(e) => setChosen(e.target.value)} className="mb-4">
          {types.leaveTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
      )}
      {data ? <ColumnChart points={toPoints(data.timeOffUsed)} unit="days" caption="Approved days by start month" /> : <div className="h-[184px]" />}
    </Widget>
  );
}

/* ----------------------------------------------------------- HR summary tiles */

function BigNumber({ icon, value, label, hint, href, tone }: { icon: IconDefinition; value: number; label: string; hint?: string; href?: string; tone?: "warn" }) {
  const body = (
    <span className="flex items-center justify-center gap-4 py-2">
      <FontAwesomeIcon icon={icon} className={cx("text-3xl", tone === "warn" && value ? "text-amber-600" : "text-muted")} />
      <span>
        <span className="block text-4xl font-semibold text-ink">{value}</span>
        <span className="block text-sm text-muted">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </span>
  );
  return href ? <Link href={href} className="block rounded-xl hover:bg-subtle">{body}</Link> : body;
}

export function TimeOffRequestsWidget({ insights }: { insights: Insights }) {
  return (
    <Widget title="Time off requests" icon={faClock}>
      <div className="divide-y divide-line">
        <BigNumber icon={faTriangleExclamation} value={insights.pendingUrgent} label="Urgent requests" hint="Starting within 7 days" href="/leave/approvals" tone="warn" />
        <BigNumber icon={faClock} value={insights.pendingOther} label="Other requests" href="/leave/approvals" />
      </div>
    </Widget>
  );
}

export function OnboardingWidget({ summary, company }: { summary: NonNullable<Insights["onboarding"]>; company: string }) {
  return (
    <Widget title={`Onboarding at ${company}`} icon={faClipboardCheck}>
      <dl className="space-y-3">
        <div className="rounded-xl bg-subtle px-4 py-3">
          <dt className="text-xs font-semibold text-brand-ink">Already started</dt>
          <dd className="mt-1 text-[15px] text-ink">
            {summary.withOverdue ? <Badge tone="warn">{summary.withOverdue} with overdue tasks</Badge> : "No one has overdue tasks"}
            <span className="block text-xs text-muted">{summary.inProgress} {summary.inProgress === 1 ? "person" : "people"} onboarding</span>
          </dd>
        </div>
        <div className="rounded-xl bg-subtle px-4 py-3">
          <dt className="text-xs font-semibold text-brand-ink">Starting in the next 30 days</dt>
          <dd className="mt-1 text-[15px] text-ink">{summary.startingSoon ? `${summary.startingSoon} ${summary.startingSoon === 1 ? "person" : "people"}` : "No one scheduled"}</dd>
        </div>
      </dl>
      <Link href="/settings/checklists" className="mt-4 inline-block text-sm font-medium text-brand-ink hover:underline">Onboarding tasks</Link>
    </Widget>
  );
}

export function PayRaiseWidget({ count }: { count: number }) {
  return (
    <Widget title="People without a pay raise" icon={faArrowTrendUp}>
      <BigNumber icon={faArrowTrendUp} value={count} label="Without a pay change" hint="for 12+ months" href="/reports" />
    </Widget>
  );
}

/* --------------------------------------------------------------- Edit widgets */

export const WIDGET_NAMES: Record<string, string> = {
  time_off: "Time off", my_stuff: "My stuff", happening: "What's happening", direct_reports: "My direct reports",
  insights: "People (headcount, turnover, locations)", celebrations: "Celebrations", whos_out: "Who's out",
  company_links: "Company links", welcome: "Welcome new people", time_off_used: "Time off used",
  time_off_requests: "Time off requests", onboarding: "Onboarding", pay_raise: "People without a pay raise",
};

const SaveLayoutDocument = graphql(`
  mutation SaveHomeLayout($widgets: JSON!) {
    saveHomeLayout(widgets: $widgets) { key hidden }
  }
`);

export function EditWidgetsDialog({ widgets, available, onClose, onSaved }: {
  widgets: HomeData["homeLayout"]; available: Set<string>; onClose: () => void; onSaved: () => void;
}) {
  const [, save] = useMutation(SaveLayoutDocument);
  // Only the widgets this person can have are listed; the rest keep their place at the end.
  const [rows, setRows] = useState(widgets.filter((w) => available.has(w.key)).map((w) => ({ key: w.key, hidden: w.hidden })));
  const rest = widgets.filter((w) => !available.has(w.key)).map((w) => ({ key: w.key, hidden: w.hidden }));
  const [busy, setBusy] = useState(false);
  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  };
  return (
    <Dialog open onClose={onClose} title="Edit your home page" description="Choose what you see and in what order. Only you see this layout."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button busy={busy} onClick={async () => { setBusy(true); await save({ widgets: [...rows, ...rest] }); setBusy(false); onSaved(); }}>Save</Button>
      </>}>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {rows.map((r, i) => {
          return (
            <li key={r.key} className="flex items-center gap-3 px-3 py-2">
              <div className="flex-1"><Checkbox label={WIDGET_NAMES[r.key] ?? r.key} checked={!r.hidden} onChange={(c) => setRows(rows.map((x) => (x.key === r.key ? { ...x, hidden: !c } : x)))} /></div>
              <IconButton label={`Move ${WIDGET_NAMES[r.key]} up`} onClick={() => move(i, -1)}><FontAwesomeIcon icon={faChevronLeft} className="rotate-90 text-xs" /></IconButton>
              <IconButton label={`Move ${WIDGET_NAMES[r.key]} down`} onClick={() => move(i, 1)}><FontAwesomeIcon icon={faChevronRight} className="rotate-90 text-xs" /></IconButton>
            </li>
          );
        })}
      </ul>
    </Dialog>
  );
}
