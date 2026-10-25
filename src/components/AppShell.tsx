"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { useMutation, useQuery } from "urql";

import { graphql } from "@/gql";
import { initials } from "@/lib/format";
import { PERMS } from "@/lib/permissions";
import { useSession, type Tenant } from "@/lib/session";

import { IconCalendarCheck, IconChart, IconCheck, IconClose, IconFile, IconHome, IconLogout, IconMenu, IconPencilGrid, IconSettings, IconShield, IconSitemap, IconUser, IconUsers } from "./icons";
import { NotificationBell } from "./Notifications";
import { useSnapshot } from "./snapshot/Snapshot";
import { IconButton, Loading, Notice, cx } from "./ui";

const LogoutDocument = graphql(`
  mutation Logout {
    logout
  }
`);

const WaitingDocument = graphql(`
  query WaitingApprovals {
    leaveApprovals { id }
  }
`);

interface NavItem {
  href: string;
  label: string;
  show: boolean;
  icon: ComponentType<{ size?: number; className?: string }>;
  /** A count shown beside the label, such as requests waiting for you. */
  count?: number;
}

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  hr_admin: "HR administrator",
  payroll_officer: "Payroll officer",
  manager: "Manager",
  employee: "Employee",
};

function Crest({ tenant }: { tenant: Tenant | null }) {
  if (tenant?.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tenant.logoUrl} alt="" className="h-9 w-9 flex-none rounded-lg border border-line bg-white object-contain p-1" />;
  }
  const label = tenant ? initials(tenant.name.replace(/\b(ltd|limited|plc|inc|the)\b\.?/gi, "")) || tenant.name[0] : "";
  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-brand font-display text-[15px] font-semibold text-white">
      {label}
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { loading, me, tenant, can, reset } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [, logout] = useMutation(LogoutDocument);
  const [openOn, setOpenOn] = useState<string | null>(null);
  const drawerOpen = openOn === pathname;
  const snapshot = useSnapshot();
  // Refreshed on each page change, so the badge drops as requests are decided.
  const [{ data: waiting }, recount] = useQuery({ query: WaitingDocument, pause: !me });
  useEffect(() => {
    if (me) recount({ requestPolicy: "network-only" });
  }, [pathname, me, recount]);

  useEffect(() => {
    if (!loading && !me) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, me, pathname, router]);

  useEffect(() => {
    if (tenant?.primaryColor) document.documentElement.style.setProperty("--brand", tenant.primaryColor);
  }, [tenant?.primaryColor]);

  if (loading || !me) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Loading />
      </div>
    );
  }

  const profileHref = me.employee ? `/employees/${me.employee.id}` : null;
  const waitingCount = waiting?.leaveApprovals.length ?? 0;
  const sections: { section: string; items: NavItem[] }[] = [
    {
      section: "",
      items: [
        { href: "/home", label: "Home", show: true, icon: IconHome },
        { href: profileHref ?? "", label: "My profile", show: !!profileHref, icon: IconUser },
      ],
    },
    {
      section: "People",
      items: [
        // List, directory and org chart in one place, as BambooHR's People page; without employees.view it opens on the directory.
        { href: "/employees", label: "People", show: true, icon: IconUsers },
        // Change requests have no menu item: they reach HR through the bell, email and the home feed.
        {
          href: "/reports", label: "Reports", icon: IconChart,
          show: can(PERMS.employeesView, PERMS.leaveManage, PERMS.compensationView),
        },
        // Company files for everyone (HR also finds employee documents there).
        { href: "/files", label: "Files", show: true, icon: IconFile },
      ],
    },
    {
      section: "Time off",
      items: [
        { href: "/leave", label: "My time off", show: !!me.employee, icon: IconCalendarCheck },
        {
          href: "/leave/approvals", label: "Approvals", icon: IconCheck, count: waitingCount,
          show: waitingCount > 0 || can(PERMS.leaveManage) || me.roles.includes("manager"),
        },
        { href: "/leave/calendar", label: "Leave calendar", show: !!me.employee || can(PERMS.leaveManage), icon: IconCalendarCheck },
      ],
    },
    {
      section: "Administration",
      items: [
        { href: "/organization", label: "Organization", show: can(PERMS.orgManage), icon: IconSitemap },
        { href: "/leave/settings", label: "Leave setup", show: can(PERMS.leaveManage), icon: IconPencilGrid },
        { href: "/settings/benefits", label: "Benefits", show: can(PERMS.employeesManage), icon: IconShield },
        { href: "/settings/checklists", label: "Onboarding", show: can(PERMS.employeesManage), icon: IconCheck },
        { href: "/settings/users", label: "Users and access", show: can(PERMS.usersManage), icon: IconShield },
        { href: "/settings/company", label: "Company settings", show: can(PERMS.tenantManage), icon: IconSettings },
      ],
    },
  ]
    .map((s) => ({ ...s, items: s.items.filter((i) => i.show) }))
    .filter((s) => s.items.length);

  // Show the most senior role; the full set is on the user's membership.
  const senior = ["owner", "hr_admin", "payroll_officer", "manager", "employee"].find((r) => me.roles.includes(r));
  const roleLabel = senior ? ROLE_LABELS[senior] : me.roles[0] ?? "";

  async function signOut() {
    await logout({});
    reset();
    router.replace("/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pb-4 pt-5">
        <Crest tenant={tenant} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">{tenant?.name}</div>
          <div className="truncate text-xs text-muted">People and payroll</div>
        </div>
        <div className="hidden lg:block"><NotificationBell /></div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Main">
        {sections.map((s) => (
          <div key={s.section || "main"} className="mt-5 first:mt-1">
            {s.section && <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted/80">{s.section}</div>}
            <ul className="space-y-0.5">
              {s.items.map((item) => {
                // "My profile" is one employee page; it should not also light up when viewing a colleague.
                // Exact match for pages that have siblings below them (/leave vs /leave/approvals).
                const exact = item.href === profileHref || item.href === "/leave" || item.href === "/employees";
                const active = exact ? pathname === item.href : pathname.startsWith(item.href) && pathname !== profileHref;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                        active ? "bg-subtle text-ink" : "text-muted hover:bg-subtle/70 hover:text-ink",
                      )}
                    >
                      {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand" aria-hidden />}
                      <Icon size={18} className={active ? "text-brand-ink" : "text-muted group-hover:text-ink"} />
                      {item.label}
                      {item.count ? (
                        <span className="ml-auto rounded-full bg-brand px-1.5 text-[11px] font-semibold leading-[18px] text-white tabular-nums">{item.count}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Link href="/account" title="Your account and security" className="-m-1 flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 transition hover:bg-subtle">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-subtle text-xs font-semibold text-ink ring-1 ring-line">{initials(me.user.fullName)}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-ink">{me.user.fullName}</div>
              <div className="truncate text-xs text-muted">{roleLabel}</div>
            </div>
          </Link>
          <IconButton label="Sign out" onClick={signOut}>
            <IconLogout size={17} />
          </IconButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2">Skip to content</a>
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-surface lg:block">{sidebar}</aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="ui-fade-in absolute inset-0 bg-black/40" onClick={() => setOpenOn(null)} aria-hidden />
          <div className="ui-slide-in absolute inset-y-0 left-0 w-[280px] border-r border-line bg-surface shadow-lg">
            <IconButton label="Close menu" className="absolute right-2 top-4 z-10" onClick={() => setOpenOn(null)}>
              <IconClose size={16} />
            </IconButton>
            {sidebar}
          </div>
        </div>
      )}

      {/* Room for the docked snapshot panel on wide screens. */}
      <div className={cx("min-w-0 transition-[padding] duration-200", snapshot.personId && "xl:pr-[392px]")}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur lg:hidden">
          <IconButton label="Open menu" onClick={() => setOpenOn(pathname)}>
            <IconMenu />
          </IconButton>
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Crest tenant={tenant} />
            <span className="truncate text-sm font-semibold text-ink">{tenant?.name}</span>
          </div>
          <NotificationBell align="right" />
        </header>

        <main id="main" className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-8 sm:py-8">
          {me.mfaSetupRequired && pathname !== "/account" && (
            <Notice tone="warning" title="Set up two-step sign-in to use your admin access">
              {tenant?.name} requires it for your role. Until then you can use the app as an employee.{" "}
              <Link href="/account" className="font-semibold underline-offset-2 hover:underline">Set it up now</Link>
            </Notice>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
