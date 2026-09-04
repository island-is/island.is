# Judicial System — Agent Guide

## Shared code

**Code used across services must live in the shared libs**
(`libs/judicial-system/*`), never be duplicated per app. If a function is
needed by more than one project — e.g. both `web` and `backend` — put it in
the appropriate lib (`@island.is/judicial-system/formatters`,
`@island.is/judicial-system/types`, ...) and import it from there. When you
find yourself copying an existing function into another project, move it to a
lib instead.

## Localization strings

We are moving away from Contentful. **Do not add new Contentful-backed
localization strings** — whether in `.strings.ts` files, `messages/` modules,
`notifications.ts`, or anywhere else using `defineMessage` / `defineMessages`.
New user-facing text should be hardcoded directly where it is used (e.g. template
literals in the calling code). Existing strings may stay as-is until migrated.

## Async style

**Prefer `async`/`await` over chained `.then()`/`.catch()`.** Await promises and
handle their results with straight-line code rather than promise chains — it
reads better and keeps error handling consistent. Make the enclosing function
`async` when needed (a `Promise`-returning function is fine where a fire-and-
forget callback is expected).

## Case file categories have three homes

Adding a value to `CaseFileCategory` is never one edit. A file that a party
uploads has to be named in all three of:

- the visibility list for that user group in `file/guards/caseFileCategory.ts`,
- the upload allowlist of the guard that accepts it, e.g.
  `file/guards/limitedAccessCreateDefendantCaseFile.guard.ts`,
- the `caseFiles` category allowlist inside the include in
  `case/limitedAccessCase.service.ts`.

The third is the one that gets missed, and the symptom is confusing: the upload
succeeds, the file is stored, and it is simply absent from every case payload,
because the query filtered it out before any guard was consulted. Visibility
guards decide downloads; that allowlist decides what the case even contains.

## Guards do not run in controller unit tests

Controller specs call the controller method directly, so every `CanActivate` in
its `@UseGuards` chain is skipped. A route can therefore be dead in production
while its specs pass.

This bites hardest when a new association is added: `AppealCaseExistsGuard`
resolves an appeal case by looking through named associations on the case, and an
appeal it has not been taught about is simply not found, so the handler never
runs. When adding an entity, association or case file category, read the guards
on the routes that will carry it — or give the guard its own spec, which is
cheap: they are plain classes over a fake request.

## Tell rows in a shared table apart with an association scope

Where one table carries two kinds of row — `appeal_case` holds a case-level
appeal, the appeals of individual ruling orders, and in time the appeal of a
verdict — put the discriminator in the Sequelize association scope on the owning
model rather than in each query's where options. Sequelize copies the scope into
the `ON` clause of every join of that alias, and **ANDs it with the include's own
`where`** rather than replacing it, so one scope covers every case table, every
case view and every list added later.

Landing it in `ON` and not `WHERE` also keeps `required: false` joins behaving:
the row simply does not join, and the case is still returned.

Read `Case.appealCase` and `Case.rulingOrderAppealCases` for the shape: one
scope selects the rows with no `ruling_file_id`, the other its complement.
Reading a kind that a scope excludes needs its own association, not a widened
scope.

## A Sequelize probe has to be built like the app

Generating SQL in a spec to assert what a query does is worth doing, but the
probe must be configured like production or it will assert against SQL that
never runs:

- register every model exported from `../repository`, not just the two in
  question, or association resolution fails on an unrelated model;
- pass `getOptions().define` from `@island.is/nest/sequelize`. Without
  `underscored`, attributes render as `"appealType"` where production emits
  `"appeal_type"`, and a passing assertion means nothing.

Stub `sequelize.query` and `queryRaw` to capture the SQL; nothing needs a
database, and the query never runs.

## Build deadline fixtures from the clock

A spec asserting that something is still inside an appeal deadline must derive
its dates from `new Date()`. A fixed service date passes until the window closes
and then fails forever, in a spec that has nothing to do with whoever is running
it that day.

## Run `nx lint`, not only `nx format:check`

Import ordering is an ESLint rule (`simple-import-sort`), not a prettier one, so
a file that `format:check` is happy with can still fail linting. CI notices and
pushes a `chore: lintfix` commit onto the branch, which then has to be merged
back before the next push.

## Derive view data with a function, not `useMemo`

For the handful of strings, flags or rows a component derives from the working
case, prefer a plain exported function over a `useMemo`. The memo tends not to
earn its keep — its dependencies are objects off the case, which lose
referential equality on every refetch, so it recomputes anyway — and it cannot
be exercised without rendering the component.

The idiom is a sibling `.logic.ts` beside the component, exporting the
derivation and tested directly; see
`InfoCard/DefendantInfo/DefendantInfo.logic.ts`. The component spec is then left
to assert what only rendering can: that the values reach the page, and that
nothing which should be hidden appears.

## Codegen

Regenerate after changing GraphQL schema/resolvers, REST controllers/DTOs, or
shared types in `@island.is/judicial-system/types`.

| Project | Command                                                      | Output                                          |
| ------- | ------------------------------------------------------------ | ----------------------------------------------- |
| backend | `yarn nx run judicial-system-backend:codegen/backend-schema` | `apps/judicial-system/backend/src/openapi.yaml` |
| api     | `yarn nx run judicial-system-api:codegen/backend-schema`     | `apps/judicial-system/api/src/api.graphql`      |
| web     | `yarn nx run judicial-system-web:codegen/frontend-client`    | generated GraphQL client/types                  |

Notes:

- **message-handler has no codegen target** — nothing to run there.
- `digital-mailbox-api` and `xrd-api` also expose `codegen/backend-schema` if you
  touch their controllers.
- Codegen type-checks/boots the app first, so it fails on any TypeScript error in
  the project — fix compile errors before assuming codegen is broken.
- To regenerate everything across the whole repo: `yarn codegen`.
- Docs: https://docs.devland.is/repository/codegen
