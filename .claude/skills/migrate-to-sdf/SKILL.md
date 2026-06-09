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
mirrors an existing legacy app while leaving the legacy app untouched.

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
  Only a **fixed set** of field components exist; option/`value`/visibility
  functions run **server-side**; the client gets JSON.

### Reference implementations (read these first)
- `libs/application/templates/hms/rental-agreement-sdf` — closest real analogue:
  HMS, `FormBuilder`, address search + `onSelectRefetch` → template API.
- `libs/application/templates/v2/hms/fire-compensation-appraisal` — the app this
  skill was written from (payment state, replaced custom components).
- `libs/application/templates/v2/examples/example-inputs` — every field type.
- `libs/application/templates/examples/example-sdf` — minimal skeleton.
- Docs: `ServerDriven-App-Sys.md`, `apps/application-system-next/SDF_EXPRESSIONS.md`.

---

## Orientation: SDF spans several separately-maintained surfaces

Enabling `useSdf` touches the central config, but the SDF pipeline expects parity
across **independently-maintained surfaces**. A migration that updates only the
data/config layer will **compile yet fail at runtime**. Keep all four in view:

- **Type/config layer** — `ApplicationTypes`, `InstitutionMapper`,
  `templateLoaders`, `tsconfig.base.json`, feature flag.
- **Routing layer** — the slug **allowlist** (`sdfEnabledApplicationSlugs.ts`).
  Miss it and the new app silently redirects to the legacy SPA.
- **Serialization layer** — every field text the SDF **GraphQL schema types as
  `String`** must pass through `resolver.resolve()` (option labels, titles,
  descriptions). An unresolved `MessageDescriptor` breaks the GraphQL response.
- **Template-api layer** — actions reach the legacy service via `namespace`, and
  externalData/visibility/display-value behavior follows the **SDF rules** below.

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
   rental-agreement-sdf):
   - Address/entity search → `addSearchField({ searchAction, options, ... })`
     backed by a `searchX` template API that returns `{ options, ...data }`.
   - "On select, load details" → a select/search with
     `onSelectRefetch: [SomeApi.action]` + `refetchTargets: [...]`, backed by a
     template API that fetches into **externalData**.
   - Server `options`/`value` closures receive `(application)` /
     `(answers, externalData)`, so legacy pure option/sum utils usually port
     verbatim.

7. **Keep the hand-written `stateMachineConfig` if the app has a PAYMENT state**
   — do **not** reach for `defineWorkflow` (the SDF sugar) when there's payment.
   `buildPaymentState` returns a raw XState node; `defineWorkflow` has no
   payment-phase affordance and just compiles to the same `stateMachineConfig`.
   SDF *does* support payment (`SdfPaymentChargeOverviewField` /
   `buildPaymentChargeOverviewField`), but `buildPaymentState` still loads the
   legacy `PaymentForm`, and no example SDF app exercises a payment phase —
   **verify the payment screen renders end-to-end early; it is the biggest unknown.**

8. **Verify:** `yarn nx lint <project>`, `tsc --noEmit -p <project>/tsconfig.lib.json`,
   build the template-api-modules. Then run the app and confirm it **loads under
   its own slug** (not redirected to the legacy SPA) and the first screen
   **renders without a GraphQL error**. Then: external data loads (mock on
   local/dev), dependent fields reveal/recompute, file upload, overview, and the
   payment → done transition. Confirm `git status` shows the legacy app unchanged
   except intentional additive template-api additions.

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
  `EQUALS`, `GT/GTE/LT/LTE`, `AND/OR/NOT`, `IF`, `SUM`, `MULTIPLY`. There is **no
  array-membership (`CONTAINS`) and no array-sum**, and it **cannot read external
  data**. Dotted ids are literal keys, not nested paths.

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
  client path (client `expr` can't read externalData). Provide a server
  `value: (answers, externalData) => string` closure. It updates via the
  **VALIDATE recompute** (`useDisplayRecompute`, debounced ~300 ms) **or** when a
  driving field triggers a screen **REFETCH** rebuild. This server-only display
  path is lightly exercised (example apps use `clientValueExpression`, which only
  works for answer-only values) — **verify it actually updates**, and prefer
  driving a REFETCH from the field that changes the inputs if it doesn't. To force
  a recompute from a field with no new data to fetch, set `onSelectRefetch` to an
  action **not in the current state's api list** (e.g. a prereq `getProperties`):
  `handleRefetch` runs no template API but still rebuilds the screen against the
  merged answers + existing external data (a "bare rebuild").

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
