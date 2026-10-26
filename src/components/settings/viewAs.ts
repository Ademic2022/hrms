"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "urql";

import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { useSession } from "@/lib/session";

const StartViewAsDocument = graphql(`
  mutation StartViewAs($id: ID!) {
    startViewAs(memberId: $id) { permissions }
  }
`);

/** "View as": see the app as this member does, read-only, until you stop (or for an hour). */
export function useViewAs() {
  const { reset } = useSession();
  const router = useRouter();
  const [, start] = useMutation(StartViewAsDocument);
  return async (memberId: string) => {
    const result = await start({ id: memberId });
    if (result.error) return errorMessage(result.error);
    reset();
    router.push("/home");
  };
}

