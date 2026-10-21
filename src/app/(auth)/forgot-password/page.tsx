"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useMutation } from "urql";

import { AuthAlert, AuthButton, AuthField, AuthInput, AuthShell } from "@/components/auth/AuthShell";
import { Notice } from "@/components/ui";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";

const RequestResetDocument = graphql(`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`);

export default function ForgotPasswordPage() {
  const [, request] = useMutation(RequestResetDocument);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!email.includes("@")) return setError("Enter your work email address.");
    setBusy(true);
    setError(undefined);
    const result = await request({ email: email.trim() });
    setBusy(false);
    if (result.error) return setError(errorMessage(result.error));
    setSent(true);
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="We will email you a link to choose a new one."
      footer={<Link href="/login" className="font-medium text-brand-ink hover:underline">Back to sign in</Link>}>
      {sent ? (
        <Notice tone="success" title="Check your email">
          If {email.trim()} belongs to an account here, a link is on its way. It works for three days. Check your spam folder if it does not arrive.
        </Notice>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          {error && <AuthAlert>{error}</AuthAlert>}
          <AuthField label="Work email">
            <AuthInput type="email" autoComplete="username" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </AuthField>
          <AuthButton type="submit" busy={busy}>Email me a link</AuthButton>
        </form>
      )}
    </AuthShell>
  );
}
