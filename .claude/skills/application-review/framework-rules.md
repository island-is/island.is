# Framework rules

The core rules live in `libs/application/AGENTS.md`; read that first. This
file adds the detail a review needs beyond it. Each rule cites the code that
implements it. Paths are relative to the repo root; re-check a line number if
the code has moved. Abbreviations:

- `CTRL`: `apps/application-system/api/src/app/modules/application/application.controller.ts`
- `ACT`: `.../application/application-action.service.ts`
- `VAL`: `.../application/tools/applicationTemplateValidation.service.ts`
- `ATH`: `libs/application/core/src/lib/ApplicationTemplateHelper.ts`

## Validation

- **The client resolver** is `libs/application/ui-shell/src/validation/resolver.ts:22-126`.
  One example of an invisible blocking error is `''` written into an array
  by `clearOnChange` (#23716).
- **A SUBMIT validation error shows only as a toast.** Field errors are
  parsed from update errors only (`ui-shell/src/components/Screen.tsx:254-256`).
- **`answerValidators` run server-side on the untrimmed payload, before
  merge** (VAL:229-232). They are deprecated; use zod.
- **Enforce consent in the schema,** not in controller `rules`.

## Answers and saving

- **Code:** the merge is `libs/application/core/src/lib/formUtils.ts:194-228`;
  the client save is `ui-shell/src/utils.ts:128-181` and
  `Screen.tsx:344-369`; `draftProgress` reset is CTRL:655-656. The shell's
  own repeater save omits `draftProgress`.
- **An array also overwrites when its last item is not an object.**
- **The repeater index screen sends `{}`;** rows are saved by
  `onUpdateRepeater`.
- **`childInputIds`** are honoured only when the custom field is the whole
  screen and has more than one id. Inside a multiField they are ignored.
- **Accordion children** are saved only inside a multiField, and never when
  `accordionItems` is a function.
- **Do not depend on two saves or transitions landing together.**
- **`getValueViaPath<T>` is an unchecked cast** returning `T | undefined`.
  Provider data lives at `externalData.<id>.data`.
- **Core `YES`/`NO` are `'yes'`/`'no'`.** Some templates (estate) define
  their own `'Yes'`.

## Access

- **Code:** subject, not actor: VAL:183, ACT:148. `mapUserToRole`:
  VAL:183-227; return `undefined` for a user who should not act. Top-level
  key matching: VAL:210-226. UPDATE write check: CTRL:603-667,
  VAL:171-227. `read: 'all'`: ATH:196-197. Provider permissions:
  CTRL:711-725 (first match wins), VAL:261-283. Event outside `on`:
  ATH:154-161.
- **The event check** (VAL:130-169; CTRL:790; #24214) is skipped when the
  `applicationSystemDisableEventPermissionCheck` flag is on. An event
  outside the state's `on` is a plain `Error`, which becomes a 500.
- **Only server-side code knows the caller:** `cond` and `assign` as
  `event.nationalId` (ACT:148), template-api actions as `auth`.
- **`allowedDelegations` is template-wide,** not per state.
- **`answerValidators` receive `(newAnswer, application)`, not the user**
  (`libs/application/types/src/lib/AnswerValidator.ts`), so they cannot
  enforce who changes a value. The update and submit DTOs take only
  `answers`, and the externalData endpoint takes provider ids.
- **A writable array is writable in full,** including entries that describe
  another party (their kennitala, `approved` flag or consent). Write access
  cannot be scoped to "my entry".
- **Treat row fields such as `applicantActors` as visible to every party.**
- **Card text** is computed from the full application in
  `.../tools/application.serializer.ts:140-161`.
- **Readiness is evaluated for the calling user,** so an assignee outside a
  kennitala-targeted flag gets "not ready". `featureFlag` wins when set.
  Otherwise production honours `readyForProduction ?? true` (VAL:73-84).
- **`PUT /assign` replaces `assignees` with the caller alone** (CTRL:565-570).
  A delegated actor cannot accept an assignment.
- **Every state change clears all assignment nonces first, even a failed
  one.** Outstanding assignee links die on any event.

## State machine and transitions

- **Code:** the transition order is ACT:112-248, with nonces cleared first.
  `onExit` with a `cond`: ACT:160-166. `assign`: ACT:153-158. Persisting
  answers sent with an event: ACT:138-211. State keys:
  `libs/application/types/src/lib/StateMachine.ts:259-262`. `meta.status`:
  ATH:62-71.
- **Within a transition,** each hook's externalData is saved as it runs,
  and the xstate transition sits between onExit and onEntry. History and
  scheduled notifications follow in `allSettled`; their failures are only
  logged.
- **A self-transition with actions counts as changed.** onEntry re-runs,
  `pruneAt` resets and a history row is written.
- **State status is `meta.status`, default `draft`.** It drives the
  my-pages bucket and the card: a draft shows a progress bar and no history.

## Template API actions

- **A failure overwrites an earlier success at the same key.**
  Data-provider failures return 200.
- **`order` 0 equals unset.** `configure({ order: 0 })` and
  `externalDataId: ''` are no-ops. `throwOnError` defaults to `true`.
- **onDelete runs when a user deletes the application.**
- **Only `{ title, summary }` error shapes show their own text,** and any
  error with a `problem` property passes through as is. All others become a
  generic 500. `values` are read from `summary` only. A generic 500 shows
  as "Eitthvað fór úrskeiðis: Villa kom upp". A field that calls a provider
  itself (`updateApplicationExternalData`) may catch the error and show its
  own message, so read the field first.
- **`shouldPersistToExternalData: false`** keeps a result in memory and in
  the response, but not in the database.
- **Apollo retries:** `libs/application/graphql/src/lib/client.ts:11`.
- **Treat the results of field lookups** (AsyncSelect, `loadItems`,
  `*Validation` queries) as client input, and re-fetch on the server before
  relying on them.

## Payment

- **`buildPaymentState` defaults**
  (`libs/application/utils/src/lib/builders/paymentStateBuilder.ts`): the
  state creates the charge on entry and prunes after one day, with
  `shouldDeleteChargeIfPaymentFulfilled` set. Pass `roles` to restrict what
  the payment role may write or delete.
- **Charge items are matched to catalog amounts by position.**
- **Keep the default `externalDataId` on `CreateChargeApi`:** invoice
  handling depends on it.
- **After the payment callback marks the payment fulfilled,**
  `PaymentPending` polls and sends SUBMIT. The callback also extends
  `pruneAt` by a month.
- **ABORT refunds and deletes the payment flow if it is paid,** then
  deletes the local row.
- **Re-entering the payment state returns the existing payment URL.**
- **Delete or prune refunds a fulfilled payment** when the state has
  `shouldDeleteChargeIfPaymentFulfilled` and its status is not `completed`.
- **The payments page needs no island.is session.**
  `apps/payments/pages/[locale]/[paymentFlowId]` loads a flow by its id
  alone, so a flow stays payable from browser history until it is closed.
  A session timeout does not end it.
- **While it waits, `PaymentPending` shows only a spinner.** Its cancel and
  retry buttons appear only after a submit error.

## Lifecycle, files and notifications

- **Users delete applications only from the list** (`ApplicationList.tsx`).
  In an unlisted state (`shouldBeListed: false`), `delete: true` is
  reachable through the API alone, not by a user.
- **The prune worker runs every 30 minutes.** It deletes attachments in
  `application.attachments` and refunds or deletes charges.
  `adminDataConfig` key parsing:
  `.../lifecycle/application-lifecycle.utils.ts:82-103`.
- **Attachments:**
  - Check the bucket and the `<applicationId>/` prefix of a stored URL
    before you presign, read or delete by it.
  - Check the scan status and file type on the server before you forward a
    file.
  - The presigned upload caps a file at 10 MB.
- **History logs belong to the exited state, keyed by its exit event.**
  `includeSubjectAndActor` shows names to every viewer.
- **Prune and scheduled notifications reach only the applicant or
  `applicantActors`.** The shared `sendNotification` goes to whoever fired
  the action.

## Client (ui-shell)

- **`refetchApplicationAfterSubmit` defaults to `false`.** After SUBMIT the
  old form stays loaded.
- **`setBeforeSubmitCallback` without `allowMultiple` replaces other
  callbacks.** `submitButtonDisabled` persists across screens unless reset.
- **Do not use a lone conditional submit action.**
  `placement: 'screen'` stores the chosen event as an answer.
- **A `backId` that matches no screen id silently does nothing.**

## Translations

- **Code:** `libs/application/ui-shell/src/hooks/useApplicationNamespaces.ts:7-17`.
- **Missing English falls back to the Icelandic Contentful text.**

## Reach

- **Also shared:** `libs/api/domains/application`, the national registry
  and payment services, the my-pages BFF and `libs/cms-translations`.
- **`InstitutionMapper.ts` and `Institution.ts` are also read by
  form-system,** by key name. A new type's `ApplicationConfigurations` and
  `institutionMapper` entries are in `libs/application/types/src/lib/`;
  `templateLoaders` is `libs/application/template-loader/src/index.ts`.
- **`examples/example-inputs` is the shared fields' test bed.**
- **Form-system** lives in `apps/form-system/*`, `apps/services/form-system`,
  `libs/form-system`, `libs/api/domains/form-system` and
  `libs/portals/*/form-system`. Apply only the shared-surface checks to it:
  BFF and scopes, card mapping, and the Institution enums.
