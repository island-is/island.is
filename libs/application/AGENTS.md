# Application system

The templates, form shell and API behind island.is applications. This file
lists framework behaviour that a single template does not reveal.

## Layout

- A template: `libs/application/templates/<name>/src/lib/template.ts` (state
  machine, roles), with `forms/`, `dataProviders/` and `dataSchema.ts`. Its
  server actions: `template-api-modules/src/lib/modules/templates/<name>`.
- The API is `apps/application-system/api`; the form shell is
  `libs/application/ui-shell`.
- Settled product rules are in a template's README under `## Decisions`.
  Read them before you change what it does.
- Core, ui-shell, ui-fields, types, template-loader, `graphql` and
  `template-api-modules/src/lib/modules/shared` serve every template. A
  change there can break any of them.

## A new application type

- Add the `ApplicationTypes` value and its entries in
  `ApplicationConfigurations`, `institutionMapper` and `templateLoaders`.
- Creating one fails with "Ekki tókst að búa til umsókn af gerðinni" until
  the gitignored client is regenerated
  (`yarn nx run api-domains-application:codegen/backend-client`) and `api`
  restarted. A TS7006 on any generated type means that library's
  `gen/fetch` is stale; run its `codegen/backend-client` target.

## Validation

- **Each request is validated alone,** against `dataSchema.partial()` and
  only the answers it carries. A submit action must re-check required
  fields, eligibility and payment.
- **A root-level `.refine`, `.superRefine` or `.transform` disables
  `.partial()`,** yet still sees only the keys sent: a rule comparing two
  fields misfires when the screen sends one. `.partial()` is also shallow.
- **The client shows only errors for the current screen's ids.**
  Single-field, repeater-child and provider screens, and multiFields whose
  visible children lack ids, filter nothing: an error anywhere in the form
  blocks Continue with no message.
- **Zod custom messages are translated only from a namespaced descriptor**
  (`params: m.x`, id `namespace:key`).

## Answers and saving

- **Answers deep-merge on the server.** An omitted key keeps its old value,
  so nothing is deleted by navigation. Arrays merge row by row unless the
  new one is shorter: a key dropped from a row survives, and reordered rows
  mix.
- **Continue sends only the screen's own answers.** A value written outside
  the field's id looks saved, vanishes on reload, and rides along with the
  next SUBMIT. Repeater child screens and ids with brackets send the whole
  top-level array.
- **SUBMIT sends every answer the client holds.** The server drops keys the
  role cannot write; UPDATE returns 403 for them.
- **`clearOnChange` resets client state only,** writing `''` unless
  `clearOnChangeDefaultValue` is set. That breaks number, enum, array and
  object schemas. Abandoned branches keep their stored values.
- **An update without `draftProgress` resets progress to 0.**

## Access

- **Delegated users act as the subject.** `mapUserToRole` and `cond` get the
  subject's kennitala, never the actor's. The role must exist in every
  state the user can reach.
- **A role's `actions` are its buttons and the only events it may send.**
  Parties sharing a role are told apart by a `cond` on `event.nationalId`
  or on server-written data.
- **`write` is separate from `actions`.** UPDATE checks only the current
  state's `write` list, so a role with no buttons can still change any key
  it may write. Lists match top-level keys only.
- **`read: 'all'` or `write: 'all'` sends every answer and all of
  `externalData` to that browser.**
- **The client cannot write `externalData`,** so what a server action
  stored there can be trusted.
- **A data provider needs its `actionId` in the role's `api` list and its
  `externalDataId` in `write.externalData`.**
- **Delegations are refused unless the template sets
  `allowedDelegations`.** Custom delegations also need `requiredScopes`.

## State machine and template API

- **A transition runs onExit, then onEntry, then persists.** Answers sent
  with the event persist only if the state changes and both succeed.
- **Put side effects for an event with a `cond` in the target state's
  `onEntry`,** not in `onExit`.
- **The current state's xstate `entry` actions re-run on every event;** make
  them idempotent. Only `answers`, `assignees` and `state` survive `assign`.
- **Never rename or remove a state key while applications use it.** Stored
  applications keep the old key and break.
- **A failed action is still stored at `externalData[<id>]`, with
  `status: 'failure'` and `data: {}`.** Test `.status`, not `.data`.
- **Actions run in groups by `order`:** groups in sequence, members in
  parallel. Negative or fractional orders run last.
- **Actions run with the caller's `auth`.** If an assignee can fire the
  event, give a shared provider (`nationalRegistry`, `userProfile`) its own
  `externalDataId`.
- **Creating an application runs the initial state's onEntry with event
  `'SUBMIT'` and ignores failures,** so that onEntry must have no side
  effects.
- **The form's Apollo client retries mutations up to five times.** Make
  external side effects idempotent.

## Payment, lifecycle and my-pages

- **Use `buildPaymentState`,** and verify payment on the server before
  delivering anything: `VerifyPaymentApi` on the payment state's `onExit`,
  or `getPaymentStatus(...).fulfilled` in the submit action.
- **Every charge code must exist in the catalog,** and the price shown
  (`PaymentChargeOverview`) must match the price charged (`chargeItems`).
- **`pruneAt` is set on create and on each state entry, never on save.**
  Give every state `meta.lifecycle`.
- **Pruning keeps only `adminDataConfig` keys.** A malformed key (a second
  `.$.`, a leading `$.`, no array before `.$.`) makes pruning fail.
- **Card text, `pendingAction`, `name` and `historyLogs` are shown to every
  viewer, admins included, and computed for every listed application in
  one `Promise.all`.** Never show what only one party may see, and never
  throw: one throw breaks the whole my-pages list.

## Client and translations

- **Section, subsection and single-field-screen conditions see only saved
  answers.** Only multiField children react live.
- **A role with no `formLoader`, or a user with no role, gets an endless
  spinner.**
- **A data-provider item's `id` must equal the provider's
  `externalDataId`,** or the user is stuck on that screen.
- **The client loads only `application.system` and
  `ApplicationConfigurations[type].translation`,** not
  `template.translationNamespaces`.
- **Contentful wins over code.** Changing `defaultMessage` on an existing id
  does nothing in production, and a plain string passed to `formatMessage`
  is never translated.
- **A feature flag in a `formLoader` only hides screens.** Enforce
  restrictions in the schema and the state machine.
