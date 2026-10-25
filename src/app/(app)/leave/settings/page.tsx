import { redirect } from "next/navigation";

/** Moved into Settings. */
export default function MovedPage() {
  redirect("/settings/time-off");
}
