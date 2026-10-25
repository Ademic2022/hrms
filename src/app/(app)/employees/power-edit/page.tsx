"use client";

import { PowerEdit } from "@/components/people/PowerEdit";
import { Notice } from "@/components/ui";
import { PERMS } from "@/lib/permissions";
import { useSession } from "@/lib/session";

export default function PowerEditPage() {
  const { can } = useSession();
  if (!can(PERMS.employeesManage)) return <Notice tone="warning" title="Not available">Power edit needs permission to manage employees.</Notice>;
  return <PowerEdit />;
}
