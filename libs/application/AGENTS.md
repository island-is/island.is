# Application system

The templates, form shell and API behind island.is applications. This file
lists framework behaviour that a single template does not reveal.

## Layout

- A template's server actions usually live in
  `template-api-modules/src/lib/modules/templates/<path>`; some modules are
  renamed.
- Adding an application type: follow "Making a new application" in
  `templates/examples/README.md`.
- Settled business rules belong in a template's README, under a heading such
  as `## Decisions` or `## Business rules`. Read them before you change what
  the template does, and update them when your change warrants it.

## Commands

- Placeholders: `<project>` is the `name` in the template's `project.json`
  (`application-templates-rental-agreement`); `<path>` is its directory
  under `libs/application/templates/` (`hms/rental-agreement`).
- Test a template: `yarn nx test <project>`. Faster, without nx:
  `NX_TASK_TARGET_PROJECT=<project> yarn jest -c libs/application/templates/<path>/<jest-config>`,
  where `<jest-config>` is the template's own `jest.config.ts` or `.js`.
  Without the variable, path aliases fail.
- Typecheck a template:
  `yarn tsc -p libs/application/templates/<path>/tsconfig.lib.json --noEmit`.
- A TS7006 on a generated type means that library's gitignored `gen/fetch`
  is stale: run `yarn nx run <client-project>:codegen/backend-client`
  (or `yarn codegen`).

## Validation

- **Each request is validated alone,** against `dataSchema.partial()` and
  only the answers it carries. A submit action must re-check required
  fields, eligibility and payment.
- **A root-level `.refine`, `.superRefine` or `.transform` disables
  `.partial()`,** so the whole refined schema is parsed as written: a
  request without a required field fails. Call `.partial()` on the
  underlying object before adding the refinement, and re-check required
  fields in the submit action. The rule still sees only the keys sent, so
  let a comparison of two fields pass when either is absent, and re-check
  the pair on submit. `.partial()` is also shallow.
- **The client shows only errors for the current screen's ids.**
  Single-field and provider screens, and multiFields whose visible
  children lack ids, filter nothing: an error anywhere in the form
  blocks Continue with no message.
- **Only `.refine` and `.superRefine` messages reach the user,** translated
  from a namespaced descriptor (`params: m.x`, id `namespace:key`). Built-in
  checks such as `.min(1, m.x)` show the generic error.

## Answers and saving

- **Answers deep-merge on the server.** An omitted key keeps its old value,
  so nothing is deleted by navigation. Arrays merge row by row unless the
  new one is shorter, or its last item is not an object (an empty array
  included): then it replaces the old array outright. Otherwise a key
  dropped from a row survives, and reordered rows mix. To clear a value,
  write an empty value the schema accepts (`''`, `[]`; `{}` does not clear
  an object, it deep-merges); to drop rows, send the shorter array.
- **Continue sends only the screen's own answers.** Keep every write under
  the field's own id: a value written elsewhere looks saved, vanishes on
  reload, and rides along with the next SUBMIT. Repeater child screens and
  ids with brackets send the whole top-level array.
- **SUBMIT sends every answer the client holds.** The server drops keys the
  role cannot write; UPDATE returns 403 for them.
- **`clearOnChange` writes `''` unless `clearOnChangeDefaultValue` is
  set.** Set it where the schema rejects `''`; it takes a string, boolean,
  number, or an array of those, not an object. Abandoned branches keep their
  stored values, so read a branch's answers only when its choice is
  selected.
- **An update without `draftProgress` resets progress to 0.**

## Access

- **Delegated users act as the subject.** `mapUserToRole` and `cond` get the
  subject's kennitala, never the actor's. The role must exist in every
  state the user can reach.
- **A role's `actions` list the only events it may send.** Its buttons come
  from the form's submit field, not from `actions`. Parties sharing a role
  are told apart by a `cond` on `event.nationalId` or on server-written
  data.
- **`write` is separate from `actions`.** UPDATE checks only the current
  state's `write` list, so a role with no `actions` can still change any key
  it may write. Lists match top-level keys only.
- **`read: 'all'` or `write: 'all'` sends every answer and all of
  `externalData` to that browser.** Give explicit key lists to any role
  that must not see other parties' data.
- **The client cannot write `externalData` directly,** but it can re-run
  any provider in its role's `api` list. Trust a stored value only as far
  as the inputs its action read.
- **A data provider needs its `actionId` in the role's `api` list and its
  `externalDataId` in `write.externalData`.**
- **Delegations are refused unless the template sets
  `allowedDelegations`.** Custom delegations also need `requiredScopes`.

## State machine and template API

- **A transition runs onExit, then onEntry, then persists.** Answers sent
  with the event persist only if the transition changes something and both
  succeed. A targetless `assign` or a self-transition counts as a change:
  it re-runs the current state's onEntry.
- **Put side effects for an event with a `cond` in the target state's
  `onEntry`.** `onExit` runs before the `cond` is checked, even when the
  state does not change.
- **The current state's xstate `entry` actions re-run on every event;** make
  them idempotent. Only `answers`, `assignees` and `state` survive `assign`.
- **Keep a state key until no stored application uses it;** add a new key
  rather than rename one.
- **A failed action is still stored at `externalData[<id>]`, with
  `status: 'failure'`, a `reason` and `data: {}`,** unless the action sets
  `shouldPersistToExternalData: false`. Test `.status`, not `.data`.
- **Actions run in groups by `order`:** groups in sequence, members in
  parallel. Every group runs, even after a failure, so check an earlier
  result's `.status` before using it. Use non-negative integers: negative or
  fractional orders run last.
- **Actions run with the caller's `auth`.** If an assignee can fire the
  event, give a shared provider (`nationalRegistry`, `userProfile`) its own
  `externalDataId`.
- **Creating an application runs the initial state's onEntry with event
  `'SUBMIT'` and ignores failures,** so limit that onEntry to lookups.
- **The form's Apollo client retries failed requests, mutations included,
  up to 4 times (5 attempts in total) with backoff.** Make external side
  effects idempotent where possible.

## Payment, lifecycle and my-pages

- **Use `buildPaymentState`,** and verify payment on the server before
  delivering anything: `VerifyPaymentApi` in the state that follows
  payment, or `getPaymentStatus(...).fulfilled` in the submit action.
- **Every charge code must exist in the catalog,** and the price shown
  (`PaymentChargeOverview`) must match the price charged (`chargeItems`).
- **`pruneAt` is set on create and on each state entry, never on save.**
  Give every state `meta.lifecycle`.
- **Pruning keeps only `adminDataConfig` keys.** A malformed key (a second
  `.$.`, a leading `$.`, no array before `.$.`) makes pruning fail.
- **Card `title`, `description`, `name` and history messages are the same
  for every viewer,** admins included, so show only what every party may
  see. A function-form `pendingAction` or `includeSubjectAndActor` receives
  the viewer's `role`, `nationalId` and `isAdmin`; branch there for anything
  party-specific.
- **Every listed application is serialized in one `Promise.all`.** Catch
  errors in your card functions and return a fallback: one throw breaks the
  whole my-pages list.

## Client and translations

- **Section, subsection and single-field-screen conditions see only saved
  answers.** Only multiField children react live, so put a field that must
  respond to the current screen in a multiField.
- **A role with no `formLoader`, or a user with no role, gets an endless
  spinner.**
- **A data-provider item's `id` defaults to the provider's
  `externalDataId`.** If you set it explicitly, it must match, or the user
  is stuck on that screen.
- **The client loads only `application.system` and
  `ApplicationConfigurations[type].translation`,** not
  `template.translationNamespaces`.
- **Contentful wins over code** wherever it has a string for that id.
  Changing `defaultMessage` on an existing id does nothing in any
  environment that reads that Contentful data, and a plain string passed to
  `formatMessage` is never translated.
- **A feature flag in a `formLoader` only hides screens.** Enforce
  restrictions in the schema and the state machine.
