import { redirect } from "next/navigation";

/** The directory moved into People; old links and bookmarks land on the right tab. */
export default async function DirectoryPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  redirect(`/employees?view=${view === "chart" ? "chart" : "directory"}`);
}
