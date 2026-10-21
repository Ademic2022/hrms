import type { CombinedError } from "urql";

import { errorMessage } from "./api";

interface FieldError {
  field?: string | null;
  message: string;
}

/**
 * Sort a mutation's problems into field errors and one message for the whole form.
 * The API names fields after the model ("legalEntity"); forms often hold the ID ("legalEntityId").
 * Returns true when there was any problem.
 */
export function reportErrors<F extends string>(
  result: { error?: CombinedError },
  errors: readonly FieldError[] | undefined,
  fields: readonly F[],
  setFieldError: (field: F, message: string) => void,
  setFormError: (message: string) => void,
): boolean {
  if (result.error) {
    setFormError(errorMessage(result.error) ?? "Something went wrong.");
    return true;
  }
  if (!errors?.length) return false;
  for (const err of errors) {
    const field = fields.find((f) => f === err.field || f === `${err.field}Id`);
    if (field) setFieldError(field, err.message);
    else setFormError(err.message);
  }
  return true;
}

/** Today as YYYY-MM-DD in the viewer's time zone, the default for effective dates. */
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
