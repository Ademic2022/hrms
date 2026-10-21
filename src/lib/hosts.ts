/**
 * Which web address a request came in on. Server-side only: TENANT_BASE_DOMAIN is not sent
 * to the browser. The platform's own address (the base domain, www. and app.) shows the
 * marketing site; every other address is, or might be, a company's own workspace.
 */
export const BASE_DOMAIN = (process.env.TENANT_BASE_DOMAIN ?? "localhost").toLowerCase();

const PLATFORM_HOSTS = new Set([BASE_DOMAIN, `www.${BASE_DOMAIN}`, `app.${BASE_DOMAIN}`, "127.0.0.1"]);

export function hostname(hostHeader: string | null | undefined) {
  return (hostHeader ?? "").split(":")[0].toLowerCase();
}

export function isPlatformHost(host: string) {
  return !host || PLATFORM_HOSTS.has(host);
}
