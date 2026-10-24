"use client";

import { faBullhorn, faCaretDown, faTableCellsLarge, faUmbrellaBeach, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery } from "urql";

import {
  AnnouncementDialog, CelebrationsWidget, CompanyLinksWidget, DirectReportsWidget, EditWidgetsDialog, HappeningWidget, HomeDataDocument,
  InsightsWidget, MyStuffWidget, OnboardingWidget, PayRaiseWidget, ReadAnnouncementDialog, TimeOffRequestsWidget, TimeOffUsedWidget,
  TimeOffWidget, WelcomeWidget, WhosOutWidget, type HomeData,
} from "@/components/home/Widgets";
import { EmployeeLeaveDocument, RequestLeaveDialog } from "@/components/leave/Leave";
import { Avatar, Button, ErrorNote, Loading, Notice } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { today } from "@/lib/forms";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

const ExpiringDocument = graphql(`
  query HomeExpiring {
    expiringDocuments(withinDays: 30) { id }
  }
`);

const MyPhotoDocument = graphql(`
  query HomeMyPhoto($id: ID!) {
    employee(id: $id) { id photoUrl }
  }
`);

type Announcement = HomeData["announcements"][number];

/** The "New…" dropdown beside the greeting. */
function NewMenu({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [open]);
  return (
    <div ref={box} className="relative">
      <Button variant="secondary" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu">
        New… <FontAwesomeIcon icon={faCaretDown} className="text-xs" />
      </Button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-lg">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function NewItem({ icon, onClick, href, children }: { icon: typeof faBullhorn; onClick?: () => void; href?: string; children: ReactNode }) {
  const className = "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink hover:bg-subtle";
  const body = <><FontAwesomeIcon icon={icon} fixedWidth className="text-muted" />{children}</>;
  return href ? <Link role="menuitem" href={href} className={className}>{body}</Link>
    : <button role="menuitem" type="button" onClick={onClick} className={className}>{body}</button>;
}

export default function HomePage() {
  const { me, can, tenant } = useSession();
  const now = today();
  const employeeId = me?.employee?.id;
  const manage = can(PERMS.employeesManage);

  const [{ data, error }, reload] = useQuery({ query: HomeDataDocument });
  const [{ data: leaveData }, reloadLeave] = useQuery({ query: EmployeeLeaveDocument, variables: {}, pause: !employeeId });
  const [{ data: expiring }] = useQuery({ query: ExpiringDocument, pause: !can(PERMS.documentsManage) });
  const [{ data: photo }] = useQuery({ query: MyPhotoDocument, variables: { id: employeeId ?? "" }, pause: !employeeId });
  const [dialog, setDialog] = useState<"request" | "post" | "edit" | null>(null);
  const [reading, setReading] = useState<Announcement | null>(null);
  const [editingPost, setEditingPost] = useState<Announcement | null>(null);
  const [notice, setNotice] = useState<string>();

  if (error) return <ErrorNote error={errorMessage(error)} />;
  if (!me || !data) return <Loading />;
  const home = data.home;
  const balances = leaveData?.employeeLeave.balances ?? [];
  const company = tenant?.name ?? "the company";
  const firstName = me.user.fullName.split(" ")[0];
  const done = (message: string) => {
    setDialog(null);
    setNotice(message);
    reload({ requestPolicy: "network-only" });
  };

  // Each widget, if this person can have it. Order and hiding come from their saved layout.
  const widgets: Record<string, ReactNode | null> = {
    time_off: employeeId && balances.length ? <TimeOffWidget balances={balances} onRequest={() => setDialog("request")} /> : null,
    my_stuff: employeeId && home.myStuff ? <MyStuffWidget stuff={home.myStuff} employeeId={employeeId} /> : null,
    happening: (
      <HappeningWidget announcements={data.announcements} newHires={home.newHires} canPost={manage} canSeeChanges={manage}
        onChanged={done} onOpen={setReading} onPost={() => { setEditingPost(null); setDialog("post"); }} />
    ),
    direct_reports: home.directReports.length ? <DirectReportsWidget reports={home.directReports} /> : null,
    insights: home.insights ? <InsightsWidget insights={home.insights} /> : null,
    celebrations: <CelebrationsWidget celebrations={home.celebrations} />,
    whos_out: <WhosOutWidget today={now} />,
    company_links: data.companyLinks.length || manage ? <CompanyLinksWidget links={data.companyLinks} canEdit={manage} onSaved={done} /> : null,
    welcome: <WelcomeWidget hires={home.newHires} company={company} />,
    time_off_used: home.insights ? <TimeOffUsedWidget /> : null,
    time_off_requests: home.insights ? <TimeOffRequestsWidget insights={home.insights} /> : null,
    onboarding: home.insights?.onboarding ? <OnboardingWidget summary={home.insights.onboarding} company={company} /> : null,
    pay_raise: home.insights && home.insights.withoutPayRaise !== null && home.insights.withoutPayRaise !== undefined
      ? <PayRaiseWidget count={home.insights.withoutPayRaise} /> : null,
  };
  const available = new Set(Object.keys(widgets).filter((k) => widgets[k] !== null));
  const shown = data.homeLayout.filter((w) => !w.hidden && available.has(w.key));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {photo?.employee?.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.employee.photoUrl} alt="" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-line" />
          ) : <span className="hidden sm:block"><Avatar name={me.user.fullName} size="lg" /></span>}
          <div>
            <p className="text-sm text-muted">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="font-display text-[34px] font-medium leading-tight text-brand-ink">Hi, {firstName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NewMenu>
            {(close) => (
              <>
                {balances.length > 0 && <NewItem icon={faUmbrellaBeach} onClick={() => { close(); setDialog("request"); }}>Time off request</NewItem>}
                {manage && <NewItem icon={faBullhorn} onClick={() => { close(); setEditingPost(null); setDialog("post"); }}>Announcement</NewItem>}
                {manage && <NewItem icon={faUserPlus} href="/employees/new">Employee</NewItem>}
              </>
            )}
          </NewMenu>
          <Button variant="secondary" icon={<FontAwesomeIcon icon={faTableCellsLarge} className="text-[13px]" />} onClick={() => setDialog("edit")}>Edit</Button>
        </div>
      </div>

      {notice && <Notice tone="success">{notice}</Notice>}
      {expiring && expiring.expiringDocuments.length > 0 && (
        <Notice tone="warning" title={`${expiring.expiringDocuments.length} ${expiring.expiringDocuments.length === 1 ? "document has" : "documents have"} expired or expire within 30 days`}>
          <Link href="/documents" className="font-semibold underline-offset-2 hover:underline">See which ones</Link>
        </Notice>
      )}
      {!employeeId && <Notice tone="info">Your account is not linked to an employee record, so there is no leave or team to show.</Notice>}

      <div className="grid grid-flow-row-dense gap-5 lg:grid-cols-3">
        {/* Wide widgets span the grid; the feed takes two columns and two rows beside the personal cards, as on BambooHR. */}
        {shown.map((w) => <Fragment key={w.key}>{widgets[w.key]}</Fragment>)}
      </div>
      {shown.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center text-sm text-muted">
          Every widget is hidden. Use Edit to bring some back.
        </div>
      )}

      {dialog === "request" && leaveData && (
        <RequestLeaveDialog balances={leaveData.employeeLeave.balances} onClose={() => setDialog(null)}
          onSaved={(status) => { reloadLeave({ requestPolicy: "network-only" }); done(status === "APPROVED" ? "Leave booked." : "Request sent to your manager."); }} />
      )}
      {dialog === "post" && <AnnouncementDialog announcement={editingPost} onClose={() => setDialog(null)} onSaved={done} />}
      {dialog === "edit" && <EditWidgetsDialog widgets={data.homeLayout} available={available} onClose={() => setDialog(null)} onSaved={() => done("Home page saved.")} />}
      {reading && (
        <ReadAnnouncementDialog announcement={reading} canEdit={manage} onClose={() => setReading(null)}
          onEdit={() => { setEditingPost(reading); setReading(null); setDialog("post"); }}
          onDeleted={() => { setReading(null); done("Announcement deleted."); }} />
      )}
    </>
  );
}
