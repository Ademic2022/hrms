"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { z } from "zod";

import { AuthAlert, AuthButton, AuthField, AuthInput, AuthShell, PasswordInput } from "@/components/auth/AuthShell";
import { graphql } from "@/gql";
import { errorMessage } from "@/lib/api";
import { useSession } from "@/lib/session";

const LoginDocument = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      me { permissions }
      errors { field message }
    }
  }
`);

const schema = z.object({
  email: z.email("Enter your work email address."),
  password: z.string().min(1, "Enter your password."),
});

type Values = z.infer<typeof schema>;

/** Only paths on this site, so a crafted ?next= cannot send people elsewhere after sign-in. */
function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/home";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { tenant, reset } = useSession();
  const [, login] = useMutation(LoginDocument);
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: Values) {
    setFormError(undefined);
    const result = await login({ input: values });
    const problem = errorMessage(result.error) ?? result.data?.login.errors[0]?.message;
    if (problem) {
      setFormError(problem);
      return;
    }
    reset();
    router.replace(safeNext(params.get("next")));
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle={tenant ? `Welcome to ${tenant.name}.` : "Sign in with your work email."}
      footer={<p>Forgot your password? Ask your HR team to reset it.</p>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError ? <AuthAlert>{formError}</AuthAlert> : null}
        <AuthField label="Work email" error={errors.email?.message}>
          <AuthInput type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus
            placeholder="you@company.com" aria-invalid={!!errors.email} {...register("email")} />
        </AuthField>
        <AuthField label="Password" error={errors.password?.message}>
          <PasswordInput autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />
        </AuthField>
        <AuthButton type="submit" busy={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"}</AuthButton>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
