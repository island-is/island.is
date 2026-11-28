# Security and privacy (SEC)

Sources: [Digital Iceland policies](https://island.is/en/o/digital-iceland/policies-terms-and-guidelines-digital-iceland), [API security](https://docs.devland.is/technical-overview/api-design-guide/security.md), [REST request](https://docs.devland.is/technical-overview/api-design-guide/rest-request.md)

- **SEC-1** Collect and store only the personal data a feature needs, and keep it only as long as it's needed. Flag new personal-data columns, caches or logs that lack a clear purpose or retention.
- **SEC-2** Never put a national ID or other sensitive identifier in a URL path or query string. Use `X-Query-<Name>` headers for query values and `X-Param-<Name>` headers with a `.name` path placeholder for path values (e.g. `X-Param-National-Id`). Prefer GUIDs as resource IDs.
- **SEC-3** No secrets in code, fixtures, docs, or agent files. Secrets live in the service's `infra/` DSL and Parameter Store. Never commit `.env.secret` or similar.
- **SEC-4** Never hard-code real kennitölur (lint rule `local-rules/disallow-kennitalas`). Test data uses known fake ones behind the documented eslint-disable comment.
- **SEC-5** Validate and type all external input at the boundary (DTOs with `class-validator`, GraphQL input types). Don't trust client-sent identity fields; take identity from the authenticated user.
- **SEC-6** Use parameterised queries. No string-built SQL (`sequelize.query` with interpolation), no `eval`/`new Function`, and no shell commands built from input.
- **SEC-7** Outbound calls go only to configured hosts. Never fetch a URL taken from user input (SSRF).
- **SEC-8** Frontend: no `dangerouslySetInnerHTML` with unsanitised content, no tokens or secrets in client bundles or `localStorage`, and no feature-flag SDK keys or user data sent to third parties from the client.
- **SEC-9** Staging runs on production data and services. Treat it as production: no test writes and no debugging that exposes data.
- **SEC-10** Dependencies need permissive licences compatible with MIT, and a reason to exist. Prefer what the repo already uses.
- **SEC-11** Report suspected incidents or exposed data immediately; don't quietly fix and move on.
