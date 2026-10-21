"use client";

import Link from "next/link";
import { useQuery } from "urql";

import { IconChart, IconChevronRight } from "@/components/icons";
import { Empty, ErrorNote, Loading, PageHeader } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { ReportCatalogDocument } from "@/lib/reports";


export default function ReportsPage() {
  const [{ data, error }] = useQuery({ query: ReportCatalogDocument });
  if (error) return <ErrorNote error={errorMessage(error)} />;
  if (!data) return <Loading />;
  const reports = data.reportCatalog;

  return (
    <>
      <PageHeader title="Reports" subtitle="Standard reports on your people, within the part of the organization you can see." />
      {reports.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Link key={r.key} href={`/reports/${r.key}`}
              className="group flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:border-line-strong hover:shadow-md">
              <span className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-subtle text-muted group-hover:text-brand-ink"><IconChart size={18} /></span>
              <span className="flex items-center justify-between gap-2 text-[15px] font-semibold text-ink">
                {r.title}
                <IconChevronRight size={16} className="text-muted transition group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 text-sm text-muted">{r.description}</span>
            </Link>
          ))}
        </div>
      ) : (
        <Empty title="No reports for you" icon={<IconChart size={18} />}>Reports need access to employee records, leave or pay.</Empty>
      )}
    </>
  );
}
