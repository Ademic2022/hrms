"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { IconPlus } from "@/components/icons";
import { Directory } from "@/components/people/Directory";
import { OrgChart } from "@/components/people/OrgChart";
import { PeopleList } from "@/components/people/PeopleList";
import { ButtonLink, Loading, PageHeader, Tabs } from "@/components/ui";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

type View = "list" | "directory" | "chart";

/** People, as BambooHR lays it out: the HR list, the company directory and the org chart under one roof. */
function People() {
  const { can } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  // The list holds personal details, so it needs employees.view; everyone else starts on the directory.
  const full = can(PERMS.employeesView);
  const asked = params.get("view") as View | null;
  const view: View = asked === "chart" || asked === "directory" || (asked === "list" && full) ? asked : full ? "list" : "directory";
  const go = (next: View, focus?: string) => {
    const q = new URLSearchParams({ view: next });
    if (focus) q.set("focus", focus);
    router.replace(`${pathname}?${q}`, { scroll: false });
  };
  const tabs: { key: View; label: string }[] = [
    ...(full ? [{ key: "list" as const, label: "List" }] : []),
    { key: "directory", label: "Directory" },
    { key: "chart", label: "Org chart" },
  ];

  return (
    <>
      <PageHeader title="People"
        actions={can(PERMS.employeesManage) ? <ButtonLink href="/employees/new" icon={<IconPlus size={16} />}>New employee</ButtonLink> : undefined} />
      <Tabs value={view} onChange={(v) => go(v)} tabs={tabs} />
      {view === "list" && <PeopleList />}
      {view === "directory" && <Directory onChart={(id) => go("chart", id)} />}
      {view === "chart" && <OrgChart focus={params.get("focus")} />}
    </>
  );
}

export default function PeoplePage() {
  return (
    <Suspense fallback={<Loading />}>
      <People />
    </Suspense>
  );
}
