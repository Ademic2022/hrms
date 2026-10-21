"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "urql";

import { graphql } from "@/gql";
import type { NotificationListQuery } from "@/gql/graphql";

import { IconBell, IconCalendarCheck, IconCheck, IconClose, IconUsers } from "./icons";
import { Spinner, cx } from "./ui";

export const NotificationListDocument = graphql(`
  query NotificationList($first: Int!, $after: String) {
    unreadNotificationCount
    notifications(first: $first, after: $after) {
      nodes { id kind title body link read createdAt }
      pageInfo { hasNextPage endCursor }
    }
  }
`);

const UnreadCountDocument = graphql(`
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`);

export const MarkReadDocument = graphql(`
  mutation MarkNotificationsRead($ids: [ID!]) {
    markNotificationsRead(ids: $ids)
  }
`);

export type NotificationRow = NotificationListQuery["notifications"]["nodes"][number];

/** "just now", "5 min ago", "3 h ago", "2 days ago", then the date. */
export function timeAgo(iso: string) {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)} day${seconds < 2 * 86400 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function KindIcon({ kind }: { kind: string }) {
  const Icon = kind === "leave.approved" ? IconCheck : kind === "leave.rejected" || kind === "leave.cancelled" ? IconClose
    : kind === "leave.delegated" ? IconUsers : IconCalendarCheck;
  const tone = kind === "leave.approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
    : kind === "leave.rejected" ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
      : "bg-subtle text-muted";
  return <span className={cx("grid h-8 w-8 flex-none place-items-center rounded-full", tone)}><Icon size={15} /></span>;
}

export function NotificationItem({ n, onOpen }: { n: NotificationRow; onOpen: (n: NotificationRow) => void }) {
  return (
    <button type="button" onClick={() => onOpen(n)}
      className={cx("flex w-full gap-3 px-4 py-3 text-left transition hover:bg-subtle/70", !n.read && "bg-brand/[0.04]")}>
      <KindIcon kind={n.kind} />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className={cx("text-sm text-ink", !n.read && "font-semibold")}>{n.title}</span>
          {!n.read && <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-brand" aria-label="Unread" />}
        </span>
        {n.body && <span className="mt-0.5 line-clamp-2 block text-[13px] text-muted">{n.body}</span>}
        <span className="mt-1 block text-xs text-muted">{timeAgo(n.createdAt)}</span>
      </span>
    </button>
  );
}

/** Opening a notification marks it read and goes to its page. */
export function useOpenNotification(onDone?: () => void) {
  const router = useRouter();
  const [, markRead] = useMutation(MarkReadDocument);
  return async (n: NotificationRow) => {
    if (!n.read) await markRead({ ids: [n.id] });
    onDone?.();
    if (n.link) router.push(n.link);
  };
}

/** The bell: unread count, refreshed every minute and on each page change, and the latest ten. */
export function NotificationBell({ align = "left" }: { align?: "left" | "right" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const [{ data: count }, recount] = useQuery({ query: UnreadCountDocument });
  const [{ data: list, fetching }, reloadList] = useQuery({ query: NotificationListDocument, variables: { first: 10 }, pause: !open });
  const [, markRead] = useMutation(MarkReadDocument);
  const unread = count?.unreadNotificationCount ?? 0;

  useEffect(() => {
    recount({ requestPolicy: "network-only" });
    const timer = setInterval(() => recount({ requestPolicy: "network-only" }), 60_000);
    return () => clearInterval(timer);
  }, [pathname, recount]);

  useEffect(() => {
    if (!open) return;
    reloadList({ requestPolicy: "network-only" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => panel.current && !panel.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, reloadList]);

  const refresh = () => {
    recount({ requestPolicy: "network-only" });
    reloadList({ requestPolicy: "network-only" });
  };
  const openNotification = useOpenNotification(() => { setOpen(false); refresh(); });
  const nodes = list?.notifications.nodes ?? [];

  return (
    <div ref={panel} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="dialog"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} title="Notifications"
        className="relative inline-grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/25">
        <IconBell size={18} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-4 text-white tabular-nums">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications"
          className={cx("ui-pop-in absolute top-11 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface shadow-lg",
            align === "left" ? "left-0" : "right-0")}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-semibold text-ink">Notifications</span>
            {unread > 0 && (
              <button type="button" className="text-[13px] font-medium text-brand-ink hover:underline"
                onClick={async () => { await markRead({ ids: null }); refresh(); }}>
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60dvh] divide-y divide-line overflow-y-auto">
            {!list && fetching ? (
              <div className="grid place-items-center py-8 text-muted"><Spinner /></div>
            ) : nodes.length ? (
              nodes.map((n) => <NotificationItem key={n.id} n={n} onOpen={openNotification} />)
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted">You are all caught up.</p>
            )}
          </div>
          <Link href="/notifications" onClick={() => setOpen(false)}
            className="block border-t border-line px-4 py-2.5 text-center text-[13px] font-medium text-brand-ink hover:bg-subtle/70">
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
