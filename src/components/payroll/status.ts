import type { BadgeTone } from "@/components/ui";

export const RUN_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: "Draft", tone: "neutral" }, review: { label: "Waiting for approval", tone: "warn" }, approved: { label: "Approved", tone: "good" },
  paid: { label: "Paid", tone: "brand" }, cancelled: { label: "Cancelled", tone: "neutral" },
};
