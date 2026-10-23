"use client";

import type { ComponentType, ReactNode } from "react";

import {
  IconAward, IconBook, IconBox, IconBriefcase, IconCalendarCheck, IconCar, IconCard, IconChart, IconFile, IconGlobe, IconHeart,
  IconChecklist, IconHistory, IconHome, IconList, IconLock, IconLogout, IconNote, IconPhone, IconShield, IconStar, IconUsers,
  IconWallet,
} from "@/components/icons";
import type { Frame } from "@/components/ui";
import { cx } from "@/components/ui";

export const SECTION_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  card: IconCard, phone: IconPhone, home: IconHome, list: IconList, lock: IconLock, briefcase: IconBriefcase,
  history: IconHistory, wallet: IconWallet, calendar: IconCalendarCheck, file: IconFile, heart: IconHeart,
  award: IconAward, star: IconStar, globe: IconGlobe, users: IconUsers, box: IconBox, book: IconBook, chart: IconChart,
  note: IconNote, car: IconCar, shield: IconShield, checklist: IconChecklist, exit: IconLogout,
};

/** A section of the employee record: an icon chip, a serif title, actions and the content. */
export function ProfileSection({ title, icon, actions, description, flush, children }: {
  title: string; icon: string; actions?: ReactNode; description?: ReactNode; flush?: boolean; children: ReactNode;
}) {
  const Icon = SECTION_ICONS[icon] ?? IconList;
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 pb-1 pt-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-subtle text-brand-ink"><Icon size={18} /></span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-[21px] font-medium leading-tight text-brand-ink">{title}</h2>
            {description && <p className="text-[13px] text-muted">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
      <div className={cx(flush ? "pt-3" : "px-5 pb-5 pt-4 sm:px-6")}>{children}</div>
    </section>
  );
}

/** A Frame (see components/ui) that draws a card as a section of the record. */
export function sectionFrame(title: string, icon: string): Frame {
  return function drawSection({ actions, description, flush, children }) {
    return <ProfileSection title={title} icon={icon} actions={actions} description={description} flush={flush}>{children}</ProfileSection>;
  };
}
