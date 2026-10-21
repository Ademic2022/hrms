import type { Metadata } from "next";

import { BASE_DOMAIN } from "@/lib/hosts";
import { SITE } from "@/lib/site";

import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = { title: `Set up your company | ${SITE.name}` };

export default function SignUpPage() {
  const suffix = BASE_DOMAIN === "localhost" ? ".localhost:3000" : `.${BASE_DOMAIN}`;
  return <SignUpForm addressSuffix={suffix} />;
}
