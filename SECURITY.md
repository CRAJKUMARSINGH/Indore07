# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| main branch | Yes |
| Tagged releases | Yes (latest two) |
| Older releases | No |

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

To report a vulnerability, please follow these steps:

1. **Email the maintainer** at the address listed on the GitHub profile, with the subject line: `[SECURITY] Indori Wuolingo — <brief description>`.
2. Include the following in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact (data exposure, privilege escalation, etc.)
   - Any suggested mitigations
3. You will receive an acknowledgment within **48 hours**.
4. We aim to release a patch within **7 days** for critical vulnerabilities and **30 days** for lower-severity issues.
5. We will credit you in the release notes unless you prefer to remain anonymous.

---

## Scope

In scope for vulnerability reports:
- API authentication and authorization flaws
- SQL injection or database-level vulnerabilities
- XSS, CSRF, or injection vulnerabilities in the frontend
- Information disclosure (private user data, credentials)
- Dependency vulnerabilities with a known exploit

Out of scope:
- Rate limiting issues without a demonstrated impact
- Theoretical vulnerabilities without proof of concept
- Issues in development-only tooling (`devDependencies`)
- Self-XSS requiring the attacker to target themselves

---

## Disclosure Policy

We follow responsible disclosure. We ask that you:
- Give us reasonable time to patch before public disclosure
- Not exploit the vulnerability beyond what is necessary to confirm it
- Not access or modify other users' data

We commit to:
- Responding promptly
- Not pursuing legal action against good-faith reporters
- Publicly acknowledging valid reports (with your permission)

---

## Known Security Mitigations

- All user inputs validated with Zod schemas on the server
- Parameterized SQL queries via Drizzle ORM (no raw string interpolation)
- CORS restricted to known origins in production
- Session secrets rotated via environment variables, never hardcoded
