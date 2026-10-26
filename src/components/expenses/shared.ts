import type { BadgeTone } from "@/components/ui";
import { graphql } from "@/gql";

/** The fields every claim list shows; codegen picks this fragment up from here. */
export const ClaimRowFields = graphql(`
  fragment ClaimRowFields on ExpenseClaim {
    id title employeeId employeeName department currency total status stage approverName submittedAt approvedAt paidAt payVia
    paymentReference payrollPeriod linesCount flags mine canDecide canPay createdAt
  }
`);

export const CLAIM_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: "Draft", tone: "neutral" }, submitted: { label: "Waiting for approval", tone: "warn" },
  approved: { label: "Approved, to be paid", tone: "brand" }, rejected: { label: "Rejected", tone: "bad" },
  paid: { label: "Paid", tone: "good" }, cancelled: { label: "Withdrawn", tone: "neutral" },
};

export function claimStatus(status: string, stage: string) {
  if (status === "submitted") return { label: stage === "manager" ? "With manager" : "With finance", tone: "warn" as BadgeTone };
  return CLAIM_STATUS[status] ?? { label: status, tone: "neutral" as BadgeTone };
}

export const FLAG: Record<string, string> = {
  over_item_limit: "Over the limit", over_month_limit: "Over the monthly limit", no_receipt: "No receipt", too_old: "Too old to claim",
};

export const ACTION: Record<string, string> = {
  created: "Started the claim", submitted: "Submitted", approved: "Approved", approved_final: "Fully approved", rejected: "Rejected",
  returned: "Sent back for changes", withdrawn: "Withdrew it", paid: "Paid",
};
