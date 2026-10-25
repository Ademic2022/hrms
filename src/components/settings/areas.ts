import {
  faBuilding, faCalendarDays, faClipboardList, faHeartPulse, faIdCard, faSitemap, faUserLock, type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PERMS } from "@/lib/permissions";

/** One settings area: a page under /settings, who may open it, and the sections it splits into. */
export type SettingsArea = {
  href: string;
  label: string;
  icon: IconDefinition;
  permission: string;
  tabs?: { key: string; label: string }[];
};

/** The areas in the Settings menu, in BambooHR's alphabetical spirit but grouped by what people look for. */
export const AREAS: SettingsArea[] = [
  {
    href: "/settings/company", label: "Company", icon: faBuilding, permission: PERMS.tenantManage,
    tabs: [
      { key: "info", label: "Company info" }, { key: "general", label: "General settings" },
      { key: "branding", label: "Logo and colour" }, { key: "security", label: "Login and security" },
    ],
  },
  { href: "/settings/users", label: "Users and access", icon: faUserLock, permission: PERMS.usersManage },
  {
    href: "/settings/organization", label: "Job organization", icon: faSitemap, permission: PERMS.orgManage,
    tabs: [
      { key: "legalEntities", label: "Legal entities" }, { key: "locations", label: "Locations" },
      { key: "departments", label: "Departments" }, { key: "jobTitles", label: "Job titles" }, { key: "grades", label: "Grades" },
    ],
  },
  { href: "/settings/fields", label: "Employee fields", icon: faIdCard, permission: PERMS.employeesManage },
  {
    href: "/settings/time-off", label: "Time off", icon: faCalendarDays, permission: PERMS.leaveManage,
    tabs: [{ key: "types", label: "Leave types" }, { key: "policies", label: "Policies" }, { key: "holidays", label: "Public holidays" }],
  },
  { href: "/settings/benefits", label: "Benefits", icon: faHeartPulse, permission: PERMS.employeesManage },
  {
    href: "/settings/checklists", label: "Onboarding and offboarding", icon: faClipboardList, permission: PERMS.employeesManage,
    tabs: [{ key: "ONBOARDING", label: "Onboarding" }, { key: "OFFBOARDING", label: "Offboarding" }],
  },
];

/** The section of a settings area shown now, kept in the address (?tab=) so the layout's menu can switch it. */
export function useSettingsTab<T extends string>(keys: readonly T[], fallback: T): [T, (next: T) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const asked = params.get("tab") as T | null;
  const tab = asked && keys.includes(asked) ? asked : fallback;
  return [tab, (next) => router.replace(`${pathname}?tab=${next}`, { scroll: false })];
}
