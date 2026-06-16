---
name: migrate-to-sdf
description: >-
  Create a new Server-Driven Forms (SDF) version of an existing legacy
  application-system template, without changing the legacy app. Use when asked
  to "migrate <app> to SDF", "make an SDF version of <app>", port a v1
  (buildForm/React) application to the new FormBuilder + application-system-next
  renderer, or build a new SDF app modeled on an existing one. Covers the
  ApplicationType registration, FormBuilder forms, reusing the existing
  template-api service via `namespace`, replacing React custom field components
  with template-api actions, and the visibility/computed-value pitfalls.
---

# Migrating an application to the SDF (Server-Driven Forms) system

This skill distills a real migration (HMS `fire-compensation-appraisal` →
`v2/hms/fire-compensation-appraisal`). Follow it to produce a new SDF app that
mirrors an existing legacy app while leaving the legacy app's behaviour untouched
(the few allowed legacy edits are additive — see DO 5, DO 7, DO 8).

Read it in two modes:
- **Building** — work top to bottom: orient on the surfaces, follow **DO**, and
  hold the **SDF rules** in mind (they shape how almost every step is written).
- **Debugging** — jump to **Troubleshooting** and match the symptom you see.

## What SDF is

- **Legacy (v1):** authored with `buildForm`/`buildSection`/`buildMultiField`,
  rendered by React in `application-system` web. Supports arbitrary React custom
  field components and client-side reactive option/value functions.
- **SDF:** authored with `FormBuilder` (`@island.is/application/core`), compiled
  to a screen payload on the server, rendered by `apps/application-system-next`.
  Only a **fixed (but growing) set** of field components exist; option/`value`/
  visibility functions run **server-side**; the client gets JSON. A FormBuilder
  field type that has no renderer yet sits in `ComponentSwitch`'s
  `unsupportedFieldTypes` and **renders nothing** until someone implements it
  across four layers (see DO 6) — this migration had to do that for the overview
  and payment-pending fields.

### Reference implementations (read these first)
- `libs/application/templates/v2/hms/fire-compensation-appraisal` — the app this
  skill was written from and the closest real analogue: HMS, `FormBuilder`,
  payment state, property search + `onSelectRefetch` → template API, and replaced
  custom components.
- `libs/application/templates/v2/examples/example-inputs` — every field type.
- Docs: `ServerDriven-App-Sys.md`, `apps/application-system-next/SDF_EXPRESSIONS.md`.

---

## Orientation: SDF spans several separately-maintained surfaces

Enabling `useSdf` touches the central config, but the SDF pipeline expects parity
across **independently-maintained surfaces**. A migration that updates only the
data/config layer will **compile yet fail at runtime**. Keep all of these in view:

- **Type/config layer** — `ApplicationTypes`, `InstitutionMapper`,
  `templateLoaders`, `tsconfig.base.json`, feature flag.
- **Routing layer** — the slug **allowlist** (`sdfEnabledApplicationSlugs.ts`).
  Miss it and the new app silently redirects to the legacy SPA.
- **Serialization layer** — every field text the SDF **GraphQL schema types as
  `String`** must pass through `resolver.resolve()` (option labels, titles,
  descriptions). An unresolved `MessageDescriptor` breaks the GraphQL response.
- **Template-api layer** — actions reach the legacy service via `namespace`, and
  externalData/visibility/display-value behavior follows the **SDF rules** below.
- **Renderer/field-set layer** — the client renders only a fixed set of fields; a
  FormBuilder type with no renderer renders **nothing** (DO 6). Answer
  persistence, page-cursor navigation and header/logo also live server-side here
  and have legacy-parity rules (**SDF rules** below).

---

## DO — the procedure

1. **Create a NEW `ApplicationType`** that coexists with the legacy one (e.g.
   `FIRE_COMPENSATION_APPRAISAL_SDF`). Register it in all of:
   - `libs/application/types/src/lib/ApplicationTypes.ts` — enum **and** an
     `ApplicationConfigurations` entry with a **new `slug`**, `useSdf: true`, and
     a `translation` namespace (you may reuse the legacy app's translation
     namespaces so messages resolve identically).
   - `libs/application/types/src/lib/InstitutionMapper.ts` — same institution.
   - `libs/application/template-loader/src/lib/templateLoaders.ts` — loader
     `import('@island.is/application/templates/...')`.
   - `tsconfig.base.json` — path alias → the new lib's `src/index.ts`.
   - **`libs/application/types/src/lib/sdfEnabledApplicationSlugs.ts`** — add the
     new slug to `SDF_ENABLED_APPLICATION_SLUGS`. **`useSdf: true` is not enough.**
     The `application-system-next` `middleware.ts` only serves slugs on this
     explicit allowlist and **redirects everything else to the legacy SPA**
     (e.g. `:4250` → `:4242`). The allowlist is maintained separately on purpose
     (to keep the Edge bundle small).
   - Feature flag — reuse the legacy flag or add an `...Sdf` one.

2. **Scaffold the lib** by copying boilerplate (`project.json`, `tsconfig*.json`,
   `.eslintrc.json`, `jest.config.ts`, `.babelrc`, `src/index.ts`) from an
   existing SDF lib **at the same directory depth**. Relative paths
   (`extends`, jest `preset`, `outDir`, `coverageDirectory`) encode the depth —
   copying from a shallower lib silently breaks them. `src/index.ts` exports the
   default template, `getDataProviders = () => import('./dataProviders')`,
   `getFields = () => Promise.resolve({})`, and re-exports schema/constants.

3. **Build forms with `FormBuilder`.** `new FormBuilder<typeof dataSchema>(id,
   title, opts).addSection(id, title, (s) => s.addPage(...)).build()`. A **page =
   one multiField screen**. Field methods live on `PageBuilder`
   (`libs/application/core/src/builders/PageBuilder.ts`): `addSelectField`,
   `addAsyncSelectField`, `addSearchField`, `addCheckboxField`, `addRadioField`,
   `addDisplayField`, `addFileUploadField`, `addOverviewField`, `addTextField`,
   `addDescriptionField`, `addSubmitField`, `addDataTableField`,
   `addStaticTableField`, etc. External-data screen:
   `section.addExternalDataProvider(...)`.
   - When wiring visibility and computed values, follow **SDF rules** below
     (client vs server `showWhen`, what `expr` can read, display values).
   - The shared applicant block works in SDF:
     `const p = applicantInformationMultiField(); section.addPage(p.id, p.title,
     (page) => page.setDescription(p.description).addFields(p.children))`.
   - **Role/delegation-based forms port verbatim.** If the legacy app serves a
     different form per role (e.g. `APPLICANT` vs a `DELEGATE`/ProcurationHolder
     with its own prerequisites form), keep the same `allowedDelegations`,
     `mapUserToRole`, and **per-role `formLoader`s** in each state. The SDF
     renderer honours the role's form like legacy.

4. **Reuse the EXISTING template-api service via `namespace`** — do **not**
   create a parallel SDF service (a `BaseTemplateApiService` instance has one
   `serviceId`; namespacing is how you route to it). The dispatcher (`getServiceId`
   in `libs/application/template-api-modules/.../template-api.service.ts`) routes by
   `actionId.split('.')[0]` when the action is namespaced, else by the
   application type. So in the new app's `dataProviders`/`template.ts`, define
   every app-specific template API with
   `defineTemplateApi({ action: 'x', namespace: ApplicationTypes.<LEGACY_TYPE> })`.
   The legacy service's `serviceId` **is** that legacy type string, so the action
   runs on it. This is exactly how shared APIs (`UserProfile`, `Payment`,
   `Identity`, `NationalRegistry`) are shared. Notes:
   - `externalData` is keyed by `externalDataId || action`, and `externalDataId`
     defaults to the plain `action`. So namespacing does **not** change the key —
     forms still read e.g. `externalData.getProperties.data`.
   - The method invoked is `this[action.action]` (the plain action name).

5. **Add NEW functions to the legacy service for SDF-only needs** (allowed as
   long as the legacy app never references them). Typical additions: a search
   action (replaces a search custom component), a by-code fetch action (replaces
   a fetch custom component), and an **SDF submit-mapper variant** that recomputes
   display sums from source instead of reading `answers.<displayId>` (display
   fields don't persist — see **SDF rules**). If a new action needs a client
   (e.g. `HmsService`), add its module to the legacy template-api module's
   `imports`.

6. **Replace React custom field components with template-api actions + SDF
   fields.** SDF cannot run arbitrary React field components: the renderer's
   `ComponentSwitch` supports a **fixed set**, and unknown/unsupported types
   render nothing. So **never import a legacy React field** (e.g. a `PropertySearch`
   from another template) and **never author a new React custom field** — compose
   from existing SDF fields + template-api actions instead. Patterns (mirror
   fire-compensation-appraisal-sdf):
   - Address/entity search → `addSearchField({ searchAction, options, ... })`
     backed by a `searchX` template API that returns `{ options, ...data }`.
   - "On select, load details" → a select/search with
     `onSelectRefetch: [SomeApi.action]` + `refetchTargets: [...]`, backed by a
     template API that fetches into **externalData**.
   - Server `options`/`value` closures receive `(application)` /
     `(answers, externalData)`, so legacy pure option/sum utils usually port
     verbatim.
   - **Composing covers search/select/checkbox/display/upload-style needs.** But
     a few FormBuilder field *types* exist with **no renderer yet** (they sit in
     `ComponentSwitch`'s `unsupportedFieldTypes`). If your app needs one — this
     migration needed `addOverviewField`, and payment apps need the
     payment-pending field — you must implement it across **four layers**, not
     author a one-off React custom field: the server **field mapper**
     (`sdf/field-mappers/*.mapper.ts`, registered in `field-mappers/index.ts`,
     resolving every `String`-typed text via `resolver.resolve()`), the
     **GraphQL model** (`libs/api/domains/application/.../sdf.model.ts`) and DTO
     (`sdf/dto/screen.dto.ts`), the **client query** selection set
     (`application-system-next/lib/graphql.ts`), and the **renderer** field
     component (moved out of `unsupportedFieldTypes` in `ComponentSwitch.tsx`).
     Budget real time for this — it is the most-underestimated part of a migration.

7. **PAYMENT — only if your app charges a fee. Most apps don't; skip this whole
   step otherwise.** If it does:
   - Keep the hand-written `stateMachineConfig`; do **not** reach for
     `defineWorkflow` (the SDF sugar). `buildPaymentState` returns a raw XState
     node; `defineWorkflow` has no payment-phase affordance and just compiles to
     the same `stateMachineConfig`. `buildPaymentState` loads the legacy
     `PaymentForm`; transition into it on `DefaultEvents.PAYMENT`.
   - **The payment-pending screen is shared infra you may have to finish.** This
     migration had to move `SdfPaymentPendingField` out of `unsupportedFieldTypes`
     and implement it (it polls `applicationPaymentStatus`, redirects to the
     gateway, and on fulfilled/cancelled dispatches `SUBMIT`/`ABORT` to drive the
     XState transition — the SDF analogue of the legacy React-Router
     `PaymentPending`). The charge-overview field (`buildPaymentChargeOverviewField`
     / `SdfPaymentChargeOverviewField`) already exists. **Verify the full
     payment → done transition end-to-end early; it is the biggest unknown.**
   - **Watch the Sequelize-snapshot trap** (see Troubleshooting): the
     `CreateChargeApi` `onEntry` action crashes with *"No template exists with id
     undefined"* unless the application is snapshotted before `changeState`.
   - **Add a dev-only mock-payment escape hatch** so you can test the flow without
     a reachable charge-FJS service: a `shouldUseMockPayment` toggle gated to
     non-production (omit it in prod), read by `Payment.createCharge` to fabricate
     a fulfilled charge. This is an allowed legacy-app addition (see DO 8).

8. **Verify:** `yarn nx lint <project>`, `tsc --noEmit -p <project>/tsconfig.lib.json`,
   build the template-api-modules. Then run the app and confirm it **loads under
   its own slug** (not redirected to the legacy SPA) and the first screen
   **renders without a GraphQL error**. Then: external data loads (mock on
   local/dev), dependent fields reveal/recompute, file upload, overview renders
   **and its "Breyta"/edit jump lands on the right page**, the header shows the
   app/institution name + logo, and (if applicable) the payment → done transition.
   Check **answer parity**: an optional field left blank must not leak an empty
   string into the submit DTO/overview, and value-bearing defaults must persist
   (see SDF rules → answer persistence). Confirm `git status` shows the legacy app
   changed only by **intentional additive** edits — new template-api actions/an
   SDF submit-mapper, plus (if payment) the **non-production** mock-payment toggle —
   and no change to the legacy form's production behaviour.

---

## SDF rules (internalize these — they shape how steps 3–6 are written)

These are the invariants of the SDF world. Most migration bugs are a violation of
one of them; each maps to a symptom in **Troubleshooting**.

- **Visibility is split client vs server.** Use **`clientShowWhen`** (the `expr`
  DSL) for instant, answer-driven, same-page reveals — the browser already has
  the answers and reveals without a new fetch:
  ```ts
  clientShowWhen: expr.or(expr.isNotEmpty('realEstate'),
                          expr.isNotEmpty('selectedPropertyByCode'))
  ```
  Reserve server **`showWhen`** for visibility that depends on `externalData`/`user`
  or that must gate inclusion server-side — it **omits the field from the screen
  payload**, so it cannot reveal without a new screen fetch.

- **Client `expr` reads answers only.** Operators: `GET`, `IS_EMPTY`/`isNotEmpty`,
  `EQUALS`, `GT/GTE/LT/LTE`, `AND/OR/NOT`, `IF`, `SUM`, `MULTIPLY`, and
  **`CONTAINS`** (array/string membership; this migration added it —
  `expr.contains('checkboxArray', value)`, where `value` is a literal, not an
  answer ref). There is still **no array-sum**, and it **cannot read external
  data**. Dotted ids are literal keys, not nested paths. If you need an operator
  that doesn't exist, it can be added (evaluator in `formExpressionEvaluator.ts`,
  helper in `formExpressionHelper.ts`, the `FormExpressionOperator` union, and
  the GraphQL type) — but prefer composing from existing operators first.

- **Fetched data lives in `externalData`, not answers.** A legacy React custom
  component often wrote fetched data into an **answer**; the SDF replacement is a
  template API whose result lands in **externalData** (under its `externalDataId`).
  Update any util/branch that read `answers.<x>` to read `externalData.<action>.data`.

- **Display fields do not persist.** Their computed value never lands in answers
  (`expr.get('displayField')` reads `answers.displayField` → `undefined`). Any
  backend logic that read those answers (DTO mapping, amount-to-pay) must
  **recompute from source** (`answers` + `externalData`) — hence the SDF
  submit-mapper variant (DO 5).

- **externalData-dependent values must be server-computed.** There is no instant
  client path (client `expr` can't read externalData). Three options, in order of
  preference:
  1. **`clientValueExpression` as a resolver function**
     `(answers, externalData) => FormExpression`. The display mapper resolves it
     to a static tree at screen-build time, so externalData-derived **literals**
     get baked into a client-evaluable expression — you get instant, answer-driven
     updates while still folding in external data. Best when the external data is
     fixed for the screen and only answers change after that.
  2. A server **`value: (answers, externalData) => string` closure**, which
     recomputes via the **VALIDATE recompute** (`useDisplayRecompute`, debounced
     ~300 ms) **or** a screen **REFETCH** rebuild. **Verify it actually updates** —
     this path is lightly exercised.
  3. If the server closure doesn't update on its own, **drive a REFETCH** from the
     field that changes the inputs. To force a recompute with no new data to
     fetch, set `onSelectRefetch` to an action **not in the current state's api
     list** (e.g. a prereq `getProperties`): `handleRefetch` runs no template API
     but still rebuilds the screen against the merged answers + existing external
     data (a "bare rebuild").

- **Answer persistence has legacy-parity rules (handled centrally, but know them).**
  SDF inputs are controlled and the server stores answers with a spread-merge that
  never deletes keys, so behaviour diverges from legacy in two ways the shared
  pipeline now corrects at the persistence boundary:
  - **Empty strings are stripped on write** (`strip-empty-answers.ts`) so an
    optional field left blank reads as *absent* (like legacy), not `''`. Don't
    re-introduce `''` leaks in your submit DTO/overview by reading a raw answer
    that may have been cleared.
  - **Value-bearing field defaults are persisted** on page-leave
    (`field-default-persistence.ts`) to mirror legacy `defaultValue` behaviour —
    **except** non-value-bearing types (`DISPLAY`, layout/copy/action fields),
    which must never persist (their `NON_VALUE_BEARING_FIELD_TYPES` set is the
    source of truth). If you add a new non-value-bearing field type, add it there.

- **The persisted page cursor must land on a *navigable* screen.** The next
  `pageIndex` is computed against the just-submitted answers
  (`resolveAdvancedPageIndex`), because those answers can flip the visibility of
  upcoming pages (page-level server `showWhen`). Persisting a raw
  `currentPageIndex + 1` that points at a conditionally-hidden page desyncs the
  cursor from the client and breaks the NEXT_PAGE idempotency check. An overview
  "Breyta"/edit button navigates by **page id** via the `GO_TO_PAGE` action
  (`goToPage`), which resolves the id to the nearest navigable screen — set the
  overview field's `backId` to the target page id.

---

## Troubleshooting (match the symptom)

| Symptom | Cause | Fix |
| --- | --- | --- |
| New app silently opens the **old** app / redirect `:4250` → `:4242` | slug not on the routing allowlist | add the slug to `SDF_ENABLED_APPLICATION_SLUGS` (DO 1) |
| Screen won't load; GraphQL **`String cannot represent value: { id, defaultMessage }`** | a `MessageDescriptor` reached a schema `String` field unresolved (the one we hit: option `label`s on checkbox/radio/select) | resolve every text prop the schema types as `String`; option labels resolve in `applySharedFieldProps` (`apps/application-system/api/.../sdf/field-mappers/utils.ts`); `SdfSelectOption.label` is `String` in the SDF model |
| Fields **appear only after navigating away and back** | a same-page reveal used server `showWhen`, which omits the field from the payload | switch that reveal to `clientShowWhen` (SDF rules → visibility) |
| A server-computed **display value never updates** | relying on the client for an externalData-dependent value (impossible) | use the server `value` closure; ensure it updates via VALIDATE recompute or drive a REFETCH (SDF rules) |
| Backend reads **`undefined`** for a display field | display fields don't persist into answers | recompute from `answers` + `externalData` in the SDF submit-mapper (DO 5) |
| A ported util reads stale/missing custom-component data | SDF puts fetched data in `externalData`, not answers | read `externalData.<action>.data` |
| An imported legacy React field, or a new custom field, **renders nothing** | `ComponentSwitch` supports only the fixed field set | compose from existing SDF fields + template-api actions (DO 6) |
| A **FormBuilder field type** (e.g. overview) renders nothing | the type has no renderer yet — it's in `unsupportedFieldTypes` | implement it across the four layers (DO 6); don't author a one-off React field |
| Payment state crashes with **"No template exists with id undefined"** | `changeState` spread `{ ...application }` dropped the Sequelize prototype getters, so `typeId` is `undefined` and `CreateChargeApi`'s translation lookup fails | snapshot the application to a plain object (`toApplicationSnapshot`) before `changeState`/action-perform (`sdf-screen.service.ts`) |
| An **empty optional field leaks `''`** into the submit DTO / overview / notification | SDF's controlled inputs + spread-merge persist `''` forever; legacy never wrote it | rely on the central empty-string strip on write (`strip-empty-answers.ts`); don't read a possibly-cleared raw answer downstream (SDF rules → answer persistence) |
| A field's **`defaultValue` never reaches answers** (or a display default wrongly persists) | default persistence only seeds value-bearing fields | value-bearing defaults persist via `field-default-persistence.ts`; if it's a new non-value-bearing type, add it to `NON_VALUE_BEARING_FIELD_TYPES` |
| Overview **"Breyta"/edit jumps to the wrong page**, or the cursor desyncs after a conditional page | persisted `pageIndex` pointed at a hidden/non-navigable screen | set the overview `backId` to the page id and let `goToPage`/`resolveAdvancedPageIndex` resolve to the nearest navigable screen (SDF rules → page cursor) |
| Header **app/institution name is blank** or logo missing | read from `form.title` (empty on NOT_STARTED) instead of the template | take `applicationName`/`institutionName` from the template (`getApplicationNameTranslationString`) and send `form.logo.name` for the client to resolve |
| A footer **state-transition button no-ops** on the final screen | it dispatched `NEXT_PAGE` (page cursor) instead of a state event | role/state-transition buttons must dispatch `SUBMIT` carrying the event name (`footer-builder.ts`) |

### Deeper server/renderer gotchas
- **Validation-error rebuild dropped in-progress answers.** On a failed
  `NEXT_PAGE`, `persistAnswersAndAdvance`
  (`apps/application-system/api/.../sdf/sdf-screen.service.ts`) rebuilt the error
  screen from the **persisted** application, discarding un-persisted answers — so
  dependent select options collapsed, display values zeroed, and fields appeared
  to "vanish behind the error." Fix: rebuild the error screen **ephemerally with
  the merged (submitted) answers**. General principle: every server
  recompute/rebuild path should reflect the user's in-progress answers.
- **A checkbox renders its validation error *below* its options** — but only if
  it has options. Empty options (because the property context was lost) make it
  look like the error "replaced" the checkboxes.
- **Making a checkbox trigger a REFETCH** (so a server-computed display updates on
  toggle) requires changes in three shared layers — the builder
  (`PageBuilder.addCheckboxField`), the field mapper
  (`sdf/field-mappers/checkbox.mapper.ts` → `applyRefetchMetadata`), and the
  renderer (`SdfCheckboxField` → dispatch `'REFETCH'`). Weigh that shared-infra
  cost against fixing the VALIDATE recompute path before doing it.

---

## Concrete file map (per migration)

| Concern | Files |
| --- | --- |
| Register the type | `ApplicationTypes.ts`, `InstitutionMapper.ts`, `template-loader/.../templateLoaders.ts`, `tsconfig.base.json`, feature flag |
| Enable SDF routing | `libs/application/types/src/lib/sdfEnabledApplicationSlugs.ts` (add slug to `SDF_ENABLED_APPLICATION_SLUGS`) |
| New lib | `libs/application/templates/.../<name>/` (project.json, tsconfig*, eslintrc, jest, babelrc, `src/index.ts`) |
| Forms | `src/forms/{prerequisitesForm,mainForm,completedForm,...}/index.ts` (FormBuilder) |
| State machine | `src/lib/template.ts` (keep `stateMachineConfig` + `buildPaymentState` if payment) |
| Schema / messages / utils | `src/lib/dataSchema.ts`, `src/lib/messages/*`, `src/utils/*` (port; adapt externalData reads + recompute display values) |
| Data providers | `src/dataProviders/index.ts` (namespace app-specific APIs to the legacy type) |
| Template API | Legacy `.../templates/<inst>/<legacy-app>/{service,module,utils}.ts` — **add** new actions + an SDF submit-mapper variant; no new module if reusing via namespace |
| Implement a missing SDF field type (**only if your app needs one not yet rendered**) | server mapper `apps/application-system/api/.../sdf/field-mappers/<x>.mapper.ts` (+ `field-mappers/index.ts`); GraphQL `libs/api/domains/application/.../sdf.model.ts` + `sdf/dto/screen.dto.ts`; client query `application-system-next/lib/graphql.ts`; renderer `application-system-next/components/form-renderer/fields/Sdf<X>Field.tsx` (+ remove from `ComponentSwitch.tsx` `unsupportedFieldTypes`) |
| Payment (**only if your app charges a fee**) | `template.ts` (`buildPaymentState`); shared `SdfPaymentPendingField`/charge-overview field; `toApplicationSnapshot` guard before `changeState`; dev-only `shouldUseMockPayment` toggle in the legacy form + schema |
| Answer parity & navigation (shared infra — usually no per-app change) | `sdf/strip-empty-answers.ts`, `sdf/field-default-persistence.ts`, `sdf-screen.service.ts` (`resolveAdvancedPageIndex`, `goToPage`) |
