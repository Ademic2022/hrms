import type { ReactNode } from "react";

import { AppShell } from "@/components/AppShell";
import { SnapshotProvider } from "@/components/snapshot/Snapshot";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SnapshotProvider>
      <AppShell>{children}</AppShell>
    </SnapshotProvider>
  );
}
