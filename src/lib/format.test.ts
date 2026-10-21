import { describe, expect, it } from "vitest";

import { formatDate, formatDays, formatMoney, formatRange, humanize, initials } from "./format";

describe("format", () => {
  it("keeps calendar dates on their day in any time zone", () => {
    expect(formatDate("2026-01-01", "en-GB")).toBe("1 Jan 2026");
    expect(formatDate(null)).toBe("—");
  });

  it("formats decimal-string money without losing the currency", () => {
    expect(formatMoney("450000.00", "NGN", "en-NG")).toContain("450,000");
    expect(formatMoney("12.5", "USD", "en-US")).toBe("$12.50");
  });

  it("humanizes enum values", () => {
    expect(humanize("ON_LEAVE")).toBe("On leave");
    expect(humanize("")).toBe("—");
  });

  it("makes initials", () => {
    expect(initials("Lola  Adeyemi")).toBe("LA");
  });

  it("counts days in words", () => {
    expect(formatDays("3.0")).toBe("3 days");
    expect(formatDays("1")).toBe("1 day");
    expect(formatDays("0.5")).toBe("0.5 day");
    expect(formatDays("12.50")).toBe("12.5 days");
  });

  it("shows a date range once, or a single date", () => {
    expect(formatRange("2026-11-02", "2026-11-02", "en-GB")).toBe("2 Nov 2026");
    expect(formatRange("2026-11-02", "2026-11-06", "en-GB")).toMatch(/^2\D+6 Nov 2026$/);
  });
});
