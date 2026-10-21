/** Illustrative product visuals for the homepage. All names and figures are sample data. */

const shadow = "shadow-[0_30px_60px_-20px_rgba(15,61,46,0.35),0_8px_20px_-8px_rgba(15,61,46,0.2)]";

function Initials({ name, tone = "bg-[#e8efe9] text-[var(--lp-green)]" }: { name: string; tone?: string }) {
  const letters = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return <span className={`grid h-8 w-8 flex-none place-items-center rounded-full text-[11px] font-semibold ${tone}`}>{letters}</span>;
}

/** An employee record: job, leave balances and documents. */
export function ProfileMock() {
  return (
    <div className={`w-[340px] rounded-2xl border border-[var(--lp-rule)] bg-white p-5 text-[12px] sm:w-[400px] ${shadow}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--lp-green)] font-display text-[17px] text-[#fffcf5]">AO</span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[19px] leading-tight text-[var(--lp-green)]">Amaka Obi</div>
          <div className="text-[var(--lp-muted)]">Senior Accountant · Finance</div>
        </div>
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-800 ring-1 ring-emerald-200">● Active</span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-[#efe9dc] py-3">
        {[["Started", "4 Mar 2024"], ["Manager", "Tunde Bello"], ["Location", "Lagos HQ"]].map(([k, v]) => (
          <div key={k}><dt className="text-[10px] text-[var(--lp-muted)]">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--lp-muted)]">Leave left</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[["Annual leave", "14", "#0f766e"], ["Sick leave", "10", "#b45309"]].map(([t, n, c]) => (
          <div key={t} className="rounded-lg border border-[#efe9dc] p-2.5">
            <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--lp-muted)]"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{t}</div>
            <div className="mt-1 font-display text-[22px] leading-none text-[var(--lp-ink)]">{n}<span className="ml-1 font-sans text-[10.5px] text-[var(--lp-muted)]">days</span></div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--lp-muted)]">Documents</div>
      <ul className="mt-2 divide-y divide-[#efe9dc]">
        {[["Employment contract", "PDF · 212 KB", null], ["International passport", "Expires in 21 days", "warn"], ["ICAN certificate", "PDF · 1.1 MB", null]].map(([t, m, w]) => (
          <li key={t} className="flex items-center justify-between py-1.5">
            <span>{t}</span>
            <span className={w ? "rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200" : "text-[10.5px] text-[var(--lp-muted)]"}>{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A manager's phone: a leave request to approve. */
export function PhoneMock() {
  return (
    <div className="w-[230px] rounded-[34px] border-[7px] border-[#16201b] bg-[#16201b] shadow-[0_40px_70px_-25px_rgba(0,0,0,0.5)]">
      <div className="overflow-hidden rounded-[27px] bg-[var(--lp-paper)] text-[11px]">
        <div className="bg-[var(--lp-green)] px-4 pb-5 pt-6 text-[#fffcf5]">
          <div className="text-[10px] text-white/70">Leave approvals</div>
          <div className="font-display text-[18px]">2 waiting for you</div>
        </div>
        <div className="-mt-3 space-y-2.5 px-2.5 pb-4">
          {[["Chidi Eze", "Annual leave", "8 – 12 Dec", "5 days"], ["Funke Ola", "Sick leave", "Tue 28 Oct", "Half day"]].map(([n, t, d, len], i) => (
            <div key={n} className="rounded-2xl bg-[var(--lp-card)] p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Initials name={n} />
                <div className="min-w-0"><div className="font-semibold">{n}</div><div className="text-[10px] text-[var(--lp-muted)]">{t} · {len}</div></div>
              </div>
              <div className="mt-2 text-[10.5px] text-[var(--lp-muted)]">{d}</div>
              {i === 0 ? (
                <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-center text-[10.5px] font-semibold">
                  <span className="rounded-full border border-[var(--lp-rule)] py-1.5">Reject</span>
                  <span className="rounded-full bg-[var(--lp-green)] py-1.5 text-[#fffcf5]">Approve</span>
                </div>
              ) : (
                <div className="relative mt-2 h-7">
                  <span className="lp-stamp absolute left-1 top-0 rounded-md border-2 border-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Approved</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"];

/** Who is away: the team leave calendar. */
export function CalendarMock() {
  const rows: [string, number, number, string, boolean][] = [
    ["Amaka Obi", 2, 5, "#0f766e", false],
    ["Chidi Eze", 7, 12, "#0f766e", true],
    ["Funke Ola", 1, 1, "#b45309", false],
    ["Ibrahim Musa", 9, 10, "#7c3aed", false],
    ["Kemi Lawal", 0, 0, "", false],
  ];
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] text-[var(--lp-ink)] ${shadow}`}>
      <div className="flex items-center justify-between border-b border-[#efe9dc] px-4 py-3">
        <span className="font-display text-[15px] text-[var(--lp-green)]">December</span>
        <span className="text-[10px] text-[var(--lp-muted)]">Engineering · 5 people</span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-28 px-3 py-1.5 text-left text-[10px] font-medium text-[var(--lp-muted)]">Person</th>
            {DAYS.map((d, i) => <th key={i} className={`py-1.5 text-center text-[9px] font-medium ${i % 7 >= 5 ? "bg-[#f5f1e8] text-[#b5ae9f]" : "text-[var(--lp-muted)]"}`}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, from, to, color, pending]) => (
            <tr key={name} className="border-t border-[#f2ede2]">
              <td className="truncate px-3 py-1.5 font-medium">{name}</td>
              {DAYS.map((_, i) => {
                const weekend = i % 7 >= 5;
                const away = color && i >= from && i <= to && !weekend;
                return (
                  <td key={i} className={`h-7 p-0.5 ${weekend ? "bg-[#f5f1e8]" : ""}`}>
                    {away && <div className="h-full rounded" style={pending
                      ? { backgroundImage: `repeating-linear-gradient(135deg, ${color} 0 3px, transparent 3px 6px)`, boxShadow: `inset 0 0 0 1.5px ${color}` }
                      : { background: color }} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A small reporting line, as the org chart shows it. */
export function OrgChartMock() {
  const person = (name: string, title: string, lead = false) => (
    <div className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[11px] shadow-sm ${lead ? "border-[var(--lp-green)]/30 bg-[var(--lp-card)]" : "border-[var(--lp-rule)] bg-white"}`}>
      <Initials name={name} tone={lead ? "bg-[var(--lp-green)] text-[#fffcf5]" : undefined} />
      <div><div className="font-semibold leading-tight">{name}</div><div className="text-[10px] text-[var(--lp-muted)]">{title}</div></div>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="w-fit">{person("Ada Owner", "Managing Director", true)}</div>
      <div className="ml-5 space-y-3 border-l-2 border-dashed border-[var(--lp-rule)] pl-5">
        <div className="w-fit">{person("Hana Bello", "HR Manager")}</div>
        <div className="w-fit">{person("Lola Adeyemi", "Engineering Lead")}</div>
        <div className="ml-5 space-y-3 border-l-2 border-dashed border-[var(--lp-rule)] pl-5">
          <div className="w-fit">{person("Dayo Nwosu", "Software Engineer")}</div>
          <div className="w-fit">{person("Chidi Eze", "Software Engineer")}</div>
        </div>
      </div>
    </div>
  );
}

/** A headcount report, as the reports page draws it. */
export function ReportMock() {
  const rows: [string, number][] = [["Engineering", 42], ["Operations", 31], ["Sales", 18], ["Finance", 9], ["People", 6]];
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div className={`rounded-2xl border border-[var(--lp-rule)] bg-white p-5 text-[12px] ${shadow}`}>
      <div className="flex items-baseline justify-between">
        <div className="font-display text-[16px] text-[var(--lp-green)]">Headcount by department</div>
        <div className="text-[10px] text-[var(--lp-muted)]">PDF · Excel · CSV</div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[["People", "106"], ["Joined this year", "23"], ["Attrition", "8.4%"]].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-[#efe9dc] p-2">
            <div className="text-[10px] text-[var(--lp-muted)]">{k}</div>
            <div className="font-display text-[19px] leading-tight">{v}</div>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map(([name, n]) => (
          <li key={name} className="grid grid-cols-[90px_1fr_28px] items-center gap-3">
            <span className="text-[var(--lp-muted)]">{name}</span>
            <span className="h-2 overflow-hidden rounded-full bg-[#f2ede2]"><span className="block h-full rounded-full bg-[var(--lp-green)]" style={{ width: `${(n / max) * 100}%` }} /></span>
            <span className="text-right tabular-nums">{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
