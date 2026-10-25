import { redirect } from "next/navigation";

/** Employee documents moved into Files. */
export default function DocumentsPage() {
  redirect("/files?view=employee");
}
