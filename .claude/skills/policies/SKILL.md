---
name: policies
description: island.is / Digital Iceland development policies as checkable rules with IDs and sources (logging and PII, security, REST and GraphQL API design, naming, feature flags, auth and delegations, accessibility, definition of done). Use when writing or reviewing code that logs, handles personal data, adds endpoints, resolvers, flags, UI strings or auth checks, or when asked whether something follows our policies.
---

# island.is policies

Rules distilled from [docs.devland.is](https://docs.devland.is) and Digital Iceland policies. Each rule has an ID so reviews can cite it (e.g. `Should: [LOG-1] ...`).

Precedence: these rules beat patterns in surrounding code. When existing code breaks a rule, follow the rule in new code and mention the existing violation; don't copy it and don't refactor it unasked.

Load only the reference files relevant to the change:

| File                                                       | Covers                                                  | Read when the change…                                        |
| ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| [references/logging.md](references/logging.md)             | `LOG-*` logging, PII in logs, levels                    | adds or changes logging or error handling                    |
| [references/security.md](references/security.md)           | `SEC-*` personal data, secrets, input, environments     | touches personal data, auth, config, secrets, external calls |
| [references/api-rest.md](references/api-rest.md)           | `REST-*` paths, errors, pagination, versioning, OpenAPI | adds or changes a REST controller, DTO or client             |
| [references/graphql.md](references/graphql.md)             | `GQL-*` naming, inputs, deprecation                     | adds or changes resolvers, models, inputs                    |
| [references/auth.md](references/auth.md)                   | `AUTH-*` scopes, delegations, tokens, audit             | adds endpoints/resolvers or touches IDS, BFF, delegations    |
| [references/naming.md](references/naming.md)               | `NAME-*` files, dirs, language, Nx tags                 | adds files, projects or new domain terms                     |
| [references/feature-flags.md](references/feature-flags.md) | `FLAG-*` ConfigCat usage                                | adds or removes a feature flag                               |
| [references/frontend.md](references/frontend.md)           | `UI-*` translations, accessibility                      | adds or changes UI                                           |
| [references/delivery.md](references/delivery.md)           | `DOD-*` definition of done, tests, PRs, reviews         | prepares a PR or reviews one                                 |
