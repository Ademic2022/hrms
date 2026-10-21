"use client";

import { useState, type FormEvent } from "react";

/** Type your company's web name and go to its sign-in page. */
export function FindCompany({ companyUrl }: { companyUrl: string }) {
  const [slug, setSlug] = useState("");
  const [suffix] = companyUrl.split("{slug}").slice(1);
  const clean = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

  function go(e: FormEvent) {
    e.preventDefault();
    // Another address (the company's subdomain), so a full page load, not client navigation.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (clean) window.location.assign(`${companyUrl.replace("{slug}", clean)}/login`);
  }

  return (
    <form onSubmit={go} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
      <label className="flex min-h-12 flex-1 items-center rounded-full border border-[var(--lp-rule)] bg-[var(--lp-card)] pl-5 pr-4 text-[15px] focus-within:border-[var(--lp-green)]">
        <span className="sr-only">Your company&apos;s web name</span>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="yourcompany" autoCapitalize="none" spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-right text-[var(--lp-ink)] outline-none placeholder:text-[var(--lp-muted)]/60" />
        <span className="text-[var(--lp-muted)]">{suffix?.replace(/^https?:\/\//, "") || ""}</span>
      </label>
      <button type="submit" className="min-h-12 rounded-full bg-[var(--lp-green)] px-6 text-[15px] font-semibold text-[#fffcf5] transition hover:bg-[var(--lp-green-2)] disabled:opacity-50" disabled={!clean}>
        Go to sign in
      </button>
    </form>
  );
}
