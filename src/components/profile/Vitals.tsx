"use client";

import Link from "next/link";
import { useSyncExternalStore, type ComponentType, type ReactNode } from "react";

import {
  IconAt, IconBriefcase, IconBuilding, IconClock, IconExternal, IconGlobe, IconHash, IconLinkedIn, IconMail, IconPhone, IconPin,
  IconSitemap, IconUser,
} from "@/components/icons";
import { formatDate } from "@/lib/format";

import { ManagerLink } from "./Header";
import type { Profile } from "./query";

const noop = () => () => {};

/** "3y 6m 9d" from a start date to today. */
export function tenure(since: string, now = new Date()) {
  const start = new Date(`${since}T00:00:00`);
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return "Starts soon";
  return [years && `${years}y`, months && `${months}m`, `${days}d`].filter(Boolean).join(" ");
}

function Row({ icon: Icon, children }: { icon: ComponentType<{ size?: number; className?: string }>; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-ink">
      <Icon size={15} className="mt-0.5 flex-none text-muted" />
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}

/** The column beside the record: how to reach the person, where they work, who they work with. */
export function Vitals({ e }: { e: Profile }) {
  // The person's local time, from their location's time zone, worked out in the browser.
  const localTime = useSyncExternalStore(noop, () => {
    const zone = e.location?.timezone;
    if (!zone) return null;
    try {
      return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZone: zone });
    } catch {
      return null;
    }
  }, () => null);
  const place = [e.location?.city, e.location?.country].filter(Boolean).join(", ") || e.location?.name;
  const reports = e.directReports;
  const social = [
    e.personal?.linkedinUrl && { label: "LinkedIn", href: e.personal.linkedinUrl, icon: IconLinkedIn },
    e.personal?.twitter && { label: `Twitter / X: ${e.personal.twitter}`, href: `https://x.com/${e.personal.twitter.replace(/^@/, "")}`, icon: IconAt },
    e.personal?.facebook && { label: "Facebook", href: e.personal.facebook.startsWith("http") ? e.personal.facebook : `https://facebook.com/${e.personal.facebook}`, icon: IconGlobe },
  ].filter(Boolean) as { label: string; href: string; icon: typeof IconAt }[];

  return (
    <aside className="space-y-6 pt-20 text-sm lg:pt-24">
      <div>
        <h3 className="mb-3 text-[13px] font-semibold text-muted">Vitals</h3>
        <ul className="space-y-2.5">
          {e.workEmail && <Row icon={IconMail}><a href={`mailto:${e.workEmail}`} className="hover:underline">{e.workEmail}</a></Row>}
          {e.workPhone && (
            <Row icon={IconBuilding}>
              <a href={`tel:${e.workPhone}`} className="hover:underline">{e.workPhone}</a>
              {e.workPhoneExt && <span className="text-muted"> ext. {e.workPhoneExt}</span>}
            </Row>
          )}
          {e.phone && <Row icon={IconPhone}><a href={`tel:${e.phone}`} className="hover:underline">{e.phone}</a></Row>}
          {social.length > 0 && (
            <li className="flex items-center gap-1 pl-6">
              {social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-subtle hover:text-ink">
                  <s.icon size={15} />
                </a>
              ))}
            </li>
          )}
          {localTime && <Row icon={IconClock}>{localTime} local time</Row>}
          {place && <Row icon={IconPin}>{place}</Row>}
          {e.department && <Row icon={IconSitemap}>{e.department.name}</Row>}
          <Row icon={IconBriefcase}>{e.employmentType.replace("_", "-").toLowerCase().replace(/^./, (c) => c.toUpperCase())}</Row>
          <Row icon={IconHash}>{e.employeeNumber}</Row>
        </ul>
      </div>
      <div className="border-t border-line pt-5">
        <h3 className="mb-2 text-[13px] font-semibold text-muted">Hire date</h3>
        <p className="text-ink">{formatDate(e.hireDate)}</p>
        <p className="text-xs text-muted">{e.terminationDate ? `Left ${formatDate(e.terminationDate)}` : tenure(e.hireDate)}</p>
      </div>
      {e.manager && (
        <div className="border-t border-line pt-5">
          <h3 className="mb-3 text-[13px] font-semibold text-muted">Manager</h3>
          <ManagerLink manager={e.manager} />
        </div>
      )}
      {reports.length > 0 && (
        <div className="border-t border-line pt-5">
          <h3 className="mb-3 text-[13px] font-semibold text-muted">Direct reports</h3>
          <ul className="space-y-2">
            {reports.slice(0, 6).map((r) => (
              <Row key={r.id} icon={IconUser}><Link href={`/employees/${r.id}`} className="hover:underline">{r.fullName}</Link></Row>
            ))}
          </ul>
          {reports.length > 6 && <p className="mt-2 pl-6 text-xs text-muted">and {reports.length - 6} more</p>}
        </div>
      )}
      <div className="border-t border-line pt-5">
        <Link href={`/employees?view=chart&focus=${e.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-brand-ink hover:underline">
          <IconExternal size={14} /> View in org chart
        </Link>
      </div>
    </aside>
  );
}
