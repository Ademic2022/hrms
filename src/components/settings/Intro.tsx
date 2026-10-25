import type { ReactNode } from "react";

/** The line under a settings area's title: what it is for, and its main action. */
export function SettingsIntro({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <p className="max-w-2xl text-sm text-muted">{children}</p>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
