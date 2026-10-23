import type { Gender, MaritalStatus } from "@/gql/graphql";
import { formatDate, humanize } from "@/lib/format";

import type { Profile } from "./query";

/** Standard fields as the API's layout names them (apps/core_hr/layout.py FIELDS). */
export type FieldKey =
  | "employee_number" | "status" | "first_name" | "middle_name" | "last_name" | "preferred_name" | "date_of_birth"
  | "gender" | "marital_status" | "nationality" | "work_email" | "personal_email" | "phone" | "work_phone"
  | "work_phone_ext" | "home_phone" | "linkedin_url" | "twitter" | "facebook" | "address_line1" | "address_line2" | "city" | "state" | "postal_code" | "country";

export interface FieldMeta {
  label: string;
  input: "text" | "email" | "tel" | "url" | "date" | "select" | "readonly";
  options?: { value: string; label: string }[];
  /** The UpdateEmployeeInput / MyDetailsInput name. */
  api: string;
  /** Changes the employee may make themselves straight away (others go to HR for approval). */
  self?: "direct" | "review";
  wide?: boolean;
}

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "FEMALE", label: "Female" }, { value: "MALE", label: "Male" }, { value: "OTHER", label: "Other" },
  { value: "UNDISCLOSED", label: "Prefer not to say" },
];
export const MARITAL: { value: MaritalStatus; label: string }[] = [
  { value: "SINGLE", label: "Single" }, { value: "MARRIED", label: "Married" }, { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" }, { value: "UNDISCLOSED", label: "Prefer not to say" },
];

export const FIELDS: Record<FieldKey, FieldMeta> = {
  employee_number: { label: "Employee #", input: "readonly", api: "employeeNumber" },
  status: { label: "Status", input: "readonly", api: "status" },
  first_name: { label: "First name", input: "text", api: "firstName", self: "review" },
  middle_name: { label: "Middle name", input: "text", api: "middleName", self: "review" },
  last_name: { label: "Last name", input: "text", api: "lastName", self: "review" },
  preferred_name: { label: "Preferred name", input: "text", api: "preferredName", self: "direct" },
  date_of_birth: { label: "Date of birth", input: "date", api: "dateOfBirth" },
  gender: { label: "Gender", input: "select", options: GENDERS, api: "gender" },
  marital_status: { label: "Marital status", input: "select", options: MARITAL, api: "maritalStatus" },
  nationality: { label: "Nationality", input: "text", api: "nationality" },
  work_email: { label: "Work email", input: "email", api: "workEmail", wide: true },
  personal_email: { label: "Personal email", input: "email", api: "personalEmail", self: "direct", wide: true },
  work_phone: { label: "Work phone", input: "tel", api: "workPhone", self: "direct" },
  work_phone_ext: { label: "Ext", input: "text", api: "workPhoneExt", self: "direct" },
  phone: { label: "Mobile phone", input: "tel", api: "phone", self: "direct" },
  home_phone: { label: "Home phone", input: "tel", api: "homePhone", self: "direct" },
  linkedin_url: { label: "LinkedIn", input: "url", api: "linkedinUrl", self: "direct", wide: true },
  twitter: { label: "Twitter / X", input: "text", api: "twitter", self: "direct" },
  facebook: { label: "Facebook", input: "text", api: "facebook", self: "direct" },
  address_line1: { label: "Address line 1", input: "text", api: "addressLine1", self: "direct", wide: true },
  address_line2: { label: "Address line 2", input: "text", api: "addressLine2", self: "direct", wide: true },
  city: { label: "City", input: "text", api: "city", self: "direct" },
  state: { label: "State", input: "text", api: "state", self: "direct" },
  postal_code: { label: "Postcode", input: "text", api: "postalCode", self: "direct" },
  country: { label: "Country", input: "text", api: "country", self: "direct" },
};

/** The value as stored (for editing): strings, enum values or ISO dates. */
export function rawValue(e: Profile, key: FieldKey): string {
  const p = e.personal;
  const values: Record<FieldKey, string | null | undefined> = {
    employee_number: e.employeeNumber, status: e.status, first_name: e.firstName, middle_name: e.middleName,
    last_name: e.lastName, preferred_name: e.preferredName, date_of_birth: e.dateOfBirth, gender: e.gender,
    marital_status: e.maritalStatus, nationality: p?.nationality, work_email: e.workEmail, personal_email: e.personalEmail,
    phone: e.phone, work_phone: e.workPhone, work_phone_ext: e.workPhoneExt, home_phone: p?.homePhone,
    linkedin_url: p?.linkedinUrl, twitter: p?.twitter, facebook: p?.facebook, address_line1: p?.addressLine1, address_line2: p?.addressLine2,
    city: p?.city, state: p?.state, postal_code: p?.postalCode, country: p?.country,
  };
  return values[key] ?? "";
}

/** Whole years since an ISO date, today. */
export function age(iso: string, now = new Date()) {
  const born = new Date(`${iso}T00:00:00`);
  let years = now.getFullYear() - born.getFullYear();
  if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) years -= 1;
  return years;
}

/** The value for reading, or null when empty. */
export function shownValue(e: Profile, key: FieldKey): string | null {
  const raw = rawValue(e, key);
  if (!raw) return null;
  const meta = FIELDS[key];
  if (key === "date_of_birth") return `${formatDate(raw)} · Age ${age(raw)}`;
  if (meta.input === "date") return formatDate(raw);
  if (meta.options) return meta.options.find((o) => o.value === raw)?.label ?? humanize(raw);
  if (key === "status") return humanize(raw);
  return raw;
}

/** Fields whose values only HR and the person see; when hidden, the API returns them empty. */
export const PERSONAL_KEYS: FieldKey[] = [
  "date_of_birth", "gender", "marital_status", "nationality", "personal_email", "phone", "home_phone", "linkedin_url",
  "twitter", "facebook",
  "address_line1", "address_line2", "city", "state", "postal_code", "country",
];
