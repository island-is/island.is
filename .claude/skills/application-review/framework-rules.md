# Framework rules

These are the facts and rules the review relies on. Each rule cites the
code that implements it. Paths are relative to the repo root; re-check a
line number if the code has moved. Abbreviations:

- `CTRL`: `apps/application-system/api/src/app/modules/application/application.controller.ts`
- `ACT`: `.../application/application-action.service.ts`
- `VAL`: `.../application/tools/applicationTemplateValidation.service.ts`
- `ATH`: `libs/application/core/src/lib/ApplicationTemplateHelper.ts`

## Validation

- **Schema validation is per request.** Update and submit validate
  `dataSchema.partial()` against the answers the request carries. A submit
  action must re-check required fields, eligibility and payment.
- **A root-level `.refine`, `.superRefine` or `.transform` disables
  `.partial()`.** Every request is then parsed whole, but still only
  against the keys it carries. A rule comparing two fields fails or passes
  spuriously when the screen sends only one.
- **`.partial()` is shallow.** Nested objects stay strict.
- **The client resolver validates every value it holds, then filters
  errors to the current screen's field ids.** Nothing is filtered on these
  screens:

  - single-field screens;
  - repeater child screens;
  - external-data provider screens;
  - multiFields whose visible children have no ids.

  A schema error anywhere then blocks Continue with no message. One
  example is `''` written into an array by `clearOnChange` (#23716).
  See `libs/application/ui-shell/src/validation/resolver.ts:22-126`.

- **A SUBMIT validation error shows only as a toast.** Field errors are
  parsed from update errors only (`ui-shell/src/components/Screen.tsx:254-256`).
- **`answerValidators` run server-side on the untrimmed payload, before
  merge** (VAL:188-191). They are deprecated; use zod.
- **Zod custom messages are translated only from a namespaced descriptor**
  (`params: m.x`, id `namespace:key`).
- **Enforce consent in the schema,** not in controller `rules`.

## Answers and saving

- **Answers deep-merge on the server**
  (`libs/application/core/src/lib/formUtils.ts:194-228`).
  - An array **overwrites** only when it is shorter, or its last item is
    not an object.
  - Otherwise rows merge **by index**. A key dropped from a row object
    survives, and reordering rows of equal length mixes them.
  - An omitted top-level key keeps its old value. Navigation never deletes
    anything.
- **On Continue, the client sends only the screen's extracted answers, but
  keeps everything typed** (`ui-shell/src/utils.ts:128-181`; `Screen.tsx:344-369`).
  - A value written outside the field's own id looks saved, vanishes on
    reload, and rides along with the next SUBMIT.
  - **Repeater child screens, and any id with brackets,** send the whole
    top-level array. The repeater index screen sends `{}`, because rows are
    saved by `onUpdateRepeater`.
  - **`childInputIds`** are honoured only when the custom field is the
    whole screen and has more than one id. Inside a multiField they are
    ignored.
  - **Accordion children** are saved only inside a multiField, and never
    when `accordionItems` is a function.
- **SUBMIT sends every answer the client holds**.
  The server silently drops keys the role cannot write. UPDATE returns 403
  for the same keys.
- **`clearOnChange` resets client form state only.** It writes `''` unless
  `clearOnChangeDefaultValue` is set, and abandoned branches keep their
  stored values.
- **An update without `draftProgress` resets draft progress to 0**
  (CTRL:655-656). The shell's own repeater save omits it.
- **`getValueViaPath<T>` is an unchecked cast** returning `T | undefined`.
  Provider data lives at `externalData.<id>.data`.
- **Core `YES`/`NO` are `'yes'`/`'no'`.** Some templates (estate) define
  their own `'Yes'`.
- **Do not depend on two saves or transitions landing together.**

## Access

- **Delegated users act as the subject.** `mapUserToRole` and `cond`
  receive the subject's kennitala, never the actor's (VAL:142; ACT:148).
- **`mapUserToRole` decides who acts** (VAL:142-186). Return a role only for a
  user who should act on the application, and `undefined` for everyone
  else. The role must exist in every state the user can reach, or the user
  gets no form (see Client).
- **A role's `actions` define buttons.** Restrict an event to one party with
  a `cond` over `event.nationalId`, or over data the server wrote. An event
  outside the state's `on` is a plain `Error`, which becomes a 500
  (ATH:154-161).
- **Role `write.answers` / `read.answers` match top-level keys only**
  (VAL:169-185). A dotted path never matches.
- **`read: 'all'` or `write: 'all'` sends every answer and all of
  externalData to that role's browser** (ATH:196-197). Give it only to a
  party who may see all of it. Treat row fields such as `applicantActors`
  as visible to every party.
- **Action-card text is shown to every viewer, admins included.**
  `actionCard` title, description and tag, `pendingAction` and
  `historyLogs` are computed from the full application
  (`.../tools/application.serializer.ts:140-161`), so they must not
  interpolate what only one party may see.
- **A data provider needs two permissions:** its `actionId` in the role's
  `api` list (CTRL:711-725, first match wins), and its resolved
  `externalDataId` in `write.externalData`, unless `write: 'all'`
  (VAL:220-242).
- **Delegations are rejected unless the template declares
  `allowedDelegations`.** That setting is template-wide, not per state.
  Custom delegations also need `requiredScopes`.
- **Readiness is evaluated for the calling user,** so an assignee outside a
  kennitala-targeted flag gets "not ready". `featureFlag` wins when set.
  Otherwise production honours `readyForProduction ?? true` (VAL:73-84).
- **`PUT /assign` replaces `assignees` with the caller alone** (CTRL:565-570).
  A delegated actor cannot accept an assignment.
- **Every state change clears all assignment nonces first, even a failed
  one**. Outstanding assignee links die on any event.

## State machine and transitions

- **The order is: clear nonces → onExit (its externalData saved) → xstate
  transition → onEntry (its externalData saved) → persist.** History and
  scheduled notifications follow in `allSettled`, and their failures are
  only logged (ACT:112-248).
- **Do not put side effects in an `onExit` whose outgoing event has a
  `cond`.** Put them in the target state's `onEntry` (ACT:160-166).
- **The current state's xstate `entry` actions re-run on every event**
  before the transition, so they must be idempotent.
- **Only `answers`, `assignees` and `state` survive an `assign`**
  (ACT:153-158).
- **Do not rename or remove a state key in a template with live
  applications** (`libs/application/types/src/lib/StateMachine.ts:259-262`).
  Stored applications keep the old key and break.
- **A self-transition with actions counts as changed.** onEntry re-runs,
  `pruneAt` resets and a history row is written.
- **Answers sent with an event persist only if the state changes and both
  onExit and onEntry succeed** (ACT:138-211).
- **State status is `meta.status`, default `draft`** (ATH:62-71). It drives
  the my-pages bucket and the card: a draft shows a progress bar and no
  history.

## Template API actions

- **A failed action is still written to `externalData[<id>]`** with
  `status: 'failure'`.
  - Presence is not success. Its `data` is `{}`, which is truthy, so a
    client that tests `…[<id>].data` instead of `.status` reads a failure
    as success.
  - A failure overwrites an earlier success at the same key.
  - Data-provider failures return 200.
- **Ordering:**
  - Actions run grouped by `order`: groups in sequence, members of a group
    in parallel.
  - `order` 0 equals unset, and negative or fractional orders run **last**.
  - `configure({ order: 0 })` and `externalDataId: ''` are no-ops.
  - `throwOnError` defaults to `true`.
- **Actions run with the caller's `auth`.** When an assignee or reviewer
  fires the event, shared providers act as them, so give such a provider
  its own `externalDataId` rather than the default (`nationalRegistry`,
  `userProfile`).
- **Creating an application runs the initial state's onEntry with event
  `'SUBMIT'`, and ignores failures**, so that onEntry must
  have no side effects.
- **onDelete runs when a user deletes the application.**
- **Only `{ title, summary }` error shapes show their own text.** `values`
  are read from `summary` only. Other shapes fall back to the generic
  message. Any error with a `problem` property passes through as is; all
  others become a generic 500.
- **`shouldPersistToExternalData: false`** keeps a result in memory and in
  the response, but not in the database.
- **The form's Apollo client retries network errors up to five times,
  mutations included** (`libs/application/graphql/src/lib/client.ts:11`).
  Make external side effects idempotent.
- **Treat the results of field lookups** (AsyncSelect, `loadItems`,
  `*Validation` queries) as client input, and re-fetch on the server before
  relying on them.

## Payment

- **`buildPaymentState`**
  (`libs/application/utils/src/lib/builders/paymentStateBuilder.ts`):
  - **On entry:** creates the charge.
  - **Exit:** a charging template verifies payment on the server before it
    delivers anything: `VerifyPaymentApi` on the payment state's `onExit`,
    or `getPaymentStatus(...).fulfilled` in its submit action.
  - **Defaults:** the state prunes after one day, with
    `shouldDeleteChargeIfPaymentFulfilled` set. Pass `roles` to restrict
    what the payment role may write or delete.
- **After the payment callback marks the payment fulfilled,**
  `PaymentPending` polls and sends SUBMIT. The callback also extends
  `pruneAt` by a month.
- **ABORT refunds and deletes the payment flow if it is paid,** then
  deletes the local row.
- **Re-entering the payment state returns the existing payment URL.**
- **Charge items are matched to catalog amounts by position,** so every
  code must exist in the catalog.
- **Delete or prune refunds a fulfilled payment** when the state has
  `shouldDeleteChargeIfPaymentFulfilled` and its status is not `completed`.
- **Keep the default `externalDataId` on `CreateChargeApi`:** invoice
  handling depends on it.
- **The price shown (`PaymentChargeOverview`, from the catalog) and the
  price charged (`chargeItems`) must stay in step.**

## Lifecycle, files and notifications

- **`pruneAt` is set on create and on each state entry.**
  - Saving answers never extends it.
  - Give every state `meta.lifecycle`.
- **The prune worker runs every 30 minutes.** It deletes attachments in
  `application.attachments`, refunds or deletes charges, and keeps only
  `adminDataConfig` keys.
- **`adminDataConfig` keys must be well formed:** no second `.$.`, no
  leading `$.`, and an array before `.$.`. A malformed key makes pruning of
  that application fail
  (`.../lifecycle/application-lifecycle.utils.ts:82-103`).
- **Attachments:**
  - Check the bucket and the `<applicationId>/` prefix of a stored URL
    before you presign, read or delete by it.
  - Check the scan status and file type on the server before you forward a
    file.
  - The presigned upload caps a file at 10 MB.
- **History logs belong to the exited state, keyed by its exit event.**
  - `includeSubjectAndActor` shows names to every viewer.
  - Action-card, `pendingAction`, `name` and `historyLogs` functions run on
    every listed application in one `Promise.all`. One throw breaks the
    whole my-pages list.
- **Prune and scheduled notifications reach only the applicant or
  `applicantActors`.** The shared `sendNotification` goes to whoever fired
  the action.

## Client (ui-shell)

- **Section, subsection and single-field-screen conditions see only saved
  answers.** They update after Continue. Only multiField children react
  live.
- **A role with no `formLoader`, or a user with no role, gets an endless
  spinner.**
- **Do not use a lone conditional submit action.**
  `placement: 'screen'` stores the chosen event as an answer.
- **`refetchApplicationAfterSubmit` defaults to `false`.** After SUBMIT the
  old form stays loaded.
- **A `backId` that matches no screen id silently does nothing.**
- **A data-provider item whose `id` differs from the provider's
  `externalDataId` leaves the user stuck** on the provider screen.
- **`setBeforeSubmitCallback` without `allowMultiple` replaces other
  callbacks.** `submitButtonDisabled` persists across screens unless
  reset.

## Translations and flags

- **The client loads only `application.system` plus
  `ApplicationConfigurations[type].translation`.** It ignores
  `template.translationNamespaces`
  (`libs/application/ui-shell/src/hooks/useApplicationNamespaces.ts:7-17`).
- **Contentful wins over code.** Editing `defaultMessage` on an existing id
  changes nothing in production. English that is missing falls back to the
  Icelandic Contentful text.
- **A plain string passed to `formatMessage` is never translated.**
- **Enforce restrictions in the schema and the state machine.** A feature
  flag in a `formLoader` only hides screens.

## Reach

- **Many templates share** core, ui-shell, ui-fields, types,
  template-loader, `template-api-modules/src/lib/modules/shared`, the
  national registry and payment services, `libs/application/graphql` (the
  Apollo client), `libs/api/domains/application`, the my-pages BFF and
  `libs/cms-translations`.
- **`InstitutionMapper.ts` and `Institution.ts` are also read by
  form-system,** by key name.
- **A new `ApplicationTypes` value needs** `templateLoaders`,
  `institutionMapper` and `ApplicationConfigurations` entries, and
  regenerated gateway `gen/fetch`.
- **`examples/example-inputs` is the shared fields' test bed.**
- **Form-system is a different product.** It lives in `apps/form-system/*`,
  `apps/services/form-system`, `libs/form-system`,
  `libs/api/domains/form-system` and `libs/portals/*/form-system`, and has
  no templates, XState, `dataSchema` or template API. Apply only the
  shared-surface checks to it: BFF and scopes, card mapping, and the
  Institution enums.
