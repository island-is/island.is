# Server-Driven Forms & Next-Generation Application System Architecture

---

Status: **Approved for Implementation**
Target Audience: Technical Shareholders, Core Architecture Team, Feature Developers, **Implementing Agents**
Technologies: TypeScript, Next.js (App Router), NestJS, GraphQL, PostgreSQL, Nx

---

## 1. Executive Summary

The current `island.is` Application System (`application-system-form` and `application-system-api`) has successfully scaled to support 90+ complex applications. However, the architectural pattern — a heavy Client-Side React SPA heavily coupled with a complex XState finite state machine and large "Fat" templates — is reaching its scalability limits.

This RFC proposes a transition to a **Server-Driven Forms (SDF)** architecture. By centralizing business logic, validations, state transitions, and UI construction in the NestJS backend, we will deploy a "dumb" Next.js frontend that strictly renders what it is commanded. Concurrently, we will introduce a modern, typed Fluent API and a Workflow Engine to replace XState, dramatically improving Developer Experience (DX) and execution speed, while providing a safe, side-by-side migration path for legacy applications.

---

## 2. The Current Architecture & Its Bottlenecks

1. **The "Fat" Frontend Payload:** The entire Abstract Syntax Tree (AST), Zod schemas, state machine logic, and conditional render checks are shipped to the client's browser. This causes massive bundle sizes and slow initial loads.
2. **Duplication of Execution:** Both the React frontend and NestJS backend evaluate the same templates to ensure security and UI consistency, leading to complex synchronization issues.
3. **XState Complexity:** XState is overly verbose for linear/branched application forms, resulting in a steep learning curve and deep nesting.
4. **Brittle Validation:** Client-side Zod validation evaluates the _entire_ schema at once, often blocking progression if a non-visible or distant field is technically invalid.
5. **The Pyramid of Doom:** The current `buildForm({ children: [ buildSection({ ... }) ] })` DSL is difficult to read, prone to bracket-matching errors, and lacks strict binding between the database schema and the UI representation.

---

## 3. The Proposed Architecture

We will split the application system into three distinct layers:

1. **The Core Definition (Backend-only):** Zod schemas, Fluent API forms, and Workflow definitions.
2. **The SDF Engine (NestJS):** Evaluates the current state, runs conditionals/validations, and emits a strictly typed GraphQL `Screen` payload.
3. **The Application Shell (Next.js):** A lightweight Server Component layout that loops over the GraphQL payload and maps it to `@island.is/island-ui/core` components.

---

## 4. Core Concepts & Implementation Specifications

### A. The Workflow Engine (Replacing XState)

We will model applications as a **Directed Graph of Phases**. Note: this is _not_ a strict DAG — real-world applications have cycles (e.g., `REJECT` returning to `draft`), and the engine must support them.

```typescript
// apps/application-system/api/src/workflows/ParentalLeave.ts
import { defineWorkflow } from '@island.is/application/core'

export const ParentalLeaveWorkflow = defineWorkflow({
  initialPhase: 'draft',
  phases: {
    draft: {
      name: 'Draft',
      status: 'draft',
      lifecycle: { shouldBeListed: true, shouldBePruned: true, whenToPrune: 30 * 24 * 3600 * 1000 },
      roles: [
        {
          id: 'applicant',
          read: 'all',
          write: 'all',
          delete: true,
          // formLoader MUST be a function — it serves two purposes:
          // 1. Lazy loading: dynamic import() creates a separate code-split chunk per form
          // 2. Context: FormLoaderArgs passes { featureFlagClient } so forms can be
          //    conditionally built at runtime (used by ~10+ templates today)
          //
          // Simple case — no feature flags:
          formLoader: () => import('./forms/DraftForm').then((m) => m.DraftForm),
          //
          // Feature-flag case (e.g. driving-license, estate, marriage-conditions):
          // formLoader: async ({ featureFlagClient }) => {
          //   const flags = await getFeatureFlags(featureFlagClient as FeatureFlagClient)
          //   return flags.showNewFlow ? NewDraftForm : LegacyDraftForm
          // },
          actions: [
            { event: 'SUBMIT', name: 'Submit', type: 'primary' },
          ],
          api: [fetchNationalRegistryData],
        },
      ],
      actionCard: {
        historyLogs: [
          { onEvent: 'SUBMIT', logMessage: 'Application submitted' },
        ],
        pendingAction: {
          displayStatus: 'info',
          title: 'In progress',
          content: 'Please complete your application',
        },
      },
      onEntry: [fetchNationalRegistryData],
      transitions: {
        SUBMIT: {
          target: 'inReview',
          guard: 'allRequiredFieldsValid',
        },
      },
    },
    inReview: {
      name: 'In Review',
      status: 'inprogress',
      lifecycle: { shouldBeListed: true, shouldBePruned: false },
      roles: [
        {
          id: 'applicant',
          read: 'all',
          write: { answers: [], externalData: [] },
          formLoader: () => import('./forms/InReviewForm').then((m) => m.InReviewForm),
        },
        {
          id: 'assignee',
          read: { answers: ['applicantName'], externalData: ['nationalRegistry'] },
          write: { answers: ['reviewDecision'] },
          formLoader: () => import('./forms/ReviewForm').then((m) => m.ReviewForm),
          actions: [
            { event: 'APPROVE', name: 'Approve', type: 'primary' },
            { event: 'REJECT', name: 'Reject', type: 'reject' },
          ],
        },
      ],
      actionCard: {
        historyLogs: [
          { onEvent: 'APPROVE', logMessage: 'Application approved' },
          { onEvent: 'REJECT', logMessage: 'Application rejected' },
        ],
        pendingAction: (application, role) => ({
          displayStatus: role === 'assignee' ? 'warning' : 'info',
          title: role === 'assignee' ? 'Review needed' : 'Waiting for review',
        }),
      },
      onEntry: [{ action: sendToDirectorateOfLabour, triggerEvent: 'SUBMIT' }],
      transitions: {
        APPROVE: { target: 'done' },
        REJECT: { target: 'draft' },
      },
    },
    done: {
      name: 'Completed',
      status: 'completed',
      lifecycle: { shouldBeListed: true, shouldBePruned: true, whenToPrune: 365 * 24 * 3600 * 1000 },
      roles: [
        {
          id: 'applicant',
          read: 'all',
          write: { answers: [], externalData: [] },
          formLoader: () => import('./forms/SuccessForm').then((m) => m.SuccessForm),
        },
      ],
    },
  },
  guards: {
    allRequiredFieldsValid: (context) => {
      return context.application.answers.applicantName !== undefined
    },
  },
})
```

**`defineWorkflow` MUST preserve all `ApplicationStateMeta` capabilities.** The current XState `stateMachineConfig` stores rich per-state metadata in `meta` on each state node. The new `defineWorkflow` phases MUST support all of these as first-class fields — they are not optional, they are load-bearing for the admin portal, Mínar síður, lifecycle management, and the SDF engine:

| Field | Type | What It Controls |
|-------|------|------------------|
| `name` | `string` | Human-readable state name (admin portal, history) |
| `status` | `'draft' \| 'inprogress' \| 'completed' \| 'approved' \| 'rejected'` | Application status badge, action card tag |
| `lifecycle` | `StateLifeCycle` | Visibility in Mínar síður (`shouldBeListed`), auto-pruning (`shouldBePruned`, `whenToPrune`, `pruneMessage`), charge deletion |
| `roles` | `RoleInState[]` | Per-role: `read`/`write` permissions, `formLoader`, `actions` (CallToAction), `api` (TemplateApi[]), `shouldBeListedForRole`, `delete` |
| `actionCard` | object | `historyLogs` (HistoryEventMessage[]), `pendingAction` (PendingAction or function), `displayPruneAt` |
| `progress` | `number` | Progress bar percentage |
| `onEntry` | `TemplateApi[]` | Backend actions triggered on entering the phase |
| `onExit` | `TemplateApi[]` | Backend actions triggered on leaving the phase |
| `onDelete` | `TemplateApi[]` | Backend actions triggered when application is deleted in this phase |

**Implementation rules for `defineWorkflow`:**

- Transition guards MUST be supported. The current XState config supports `cond` on transitions (e.g., "only allow SUBMIT if payment is complete"). `defineWorkflow` must expose a `guards` map and reference guards by name on transitions.
- `onEntry` hooks MUST be idempotent-safe. In a cycle (`REJECT` -> `draft` -> `SUBMIT` -> `inReview`), `onEntry` fires every re-entry. The existing `TemplateApiActionRunner` handles `triggerEvent` filtering for this. The new engine surfaces this as: `onEntry: [{ action: sendToDirectorateOfLabour, triggerEvent: 'SUBMIT' }]`.
- The engine stores the current phase as a string in the application's `state` column, identical to how XState states are stored today. This ensures DB-level compatibility during migration.
- `defineWorkflow` internally compiles to the same `stateMachineConfig` + `ApplicationStateMeta` structure that the existing system uses. The `AstAdapter` and `ApplicationTemplateHelper` see no difference. This is critical — the admin portal, lifecycle worker, and Mínar síður all read `ApplicationStateMeta` from the template; `defineWorkflow` must produce it.

**`defineWorkflow` is only one part of the template.** The full `ApplicationTemplate` interface (defined in `libs/application/types/src/lib/ApplicationTemplate.ts`) has many fields beyond the state machine. A complete SDF template must provide ALL of these:

```typescript
// libs/application/templates/dog-license/src/lib/template.ts
import { defineWorkflow } from '@island.is/application/core'
import { DogLicenseSchema } from './dataSchema'

export default {
  type: ApplicationTypes.DOG_LICENSE,
  name: 'Dog License Application',
  codeOwner: CodeOwners.Island,
  institution: 'Municipality',
  translationNamespaces: ['dl.application'],
  dataSchema: DogLicenseSchema,                        // Zod schema — REQUIRED
  featureFlag: Features.DogLicense,                     // Feature flag for readyForProduction checks
  allowedDelegations: [{ type: 'ProcurationHolder' }],  // Who can apply on behalf of others
  requiredScopes: ['@island.is/applications:write'],    // Auth scopes
  allowMultipleApplicationsInDraft: false,

  // mapUserToRole — REQUIRED. Determines which role the current user has in a given state.
  // This drives: which form they see (via formLoader in RoleInState), which answers
  // they can read/write, which actions they can take, and whether they see the app at all.
  mapUserToRole(nationalId: string, application: Application): ApplicationRole | undefined {
    if (nationalId === application.applicant) return 'applicant'
    if (application.assignees.includes(nationalId)) return 'reviewer'
    return undefined
  },

  // answerValidators — Custom per-field server-side validators beyond Zod schema
  answerValidators: {
    dogBreed: (newAnswer, application) => {
      if (newAnswer === 'banned-breed') return { message: 'Breed not allowed', path: 'dogBreed' }
      return undefined
    },
  },

  // adminDataConfig — Controls what data survives pruning for admin portal display
  adminDataConfig: {
    postPruneDelayOverride: 2 * 365 * 24 * 3600 * 1000, // 2 years after prune
    answers: [
      { key: 'applicantName', isListed: true, label: 'Applicant' },
      { key: 'dogBreed', isListed: true, label: 'Breed' },
      { key: 'applicantNationalId', isListed: false, isNationalId: true },
    ],
    externalData: [
      { key: 'municipalityData.data.region' },
    ],
  },

  // The workflow (state machine) — this is the defineWorkflow output
  ...DogLicenseWorkflow,
} satisfies ApplicationTemplate<any, any, any>
```

**Fields that the implementing agent MUST understand:**

| Field | Purpose | Consumed By |
|-------|---------|-------------|
| `dataSchema` (Zod) | Server-side answer validation on every `NEXT_PAGE` and `SUBMIT`. The SDF engine calls `dataSchema.parse(answers)` scoped to the current screen's field IDs. | SDF Controller (`POST /sdf/:id/action`), `ApplicationTemplateValidationService` |
| `mapUserToRole` | Given a `nationalId` and `Application`, returns the user's role string (e.g., `'applicant'`, `'assignee'`). The SDF engine uses this to select the correct `RoleInState`, which determines the form, permissions, and actions. | SDF Controller, `AstAdapterService` (Step 3 in §5.3), `ApplicationAccessService`, delegation guard |
| `answerValidators` | Per-field custom validation beyond Zod (e.g., cross-field checks, external lookups). Keyed by field ID. | `ApplicationTemplateValidationService.validateIncomingAnswers` |
| `adminDataConfig` | After an application is pruned (auto-deleted past its `whenToPrune`), these answer/externalData fields are retained for admin portal visibility. `postPruneDelayOverride` controls how long they survive. | `ApplicationLifeCycleService.pruneApplication`, admin portal serializer |
| `allowedDelegations` | Defines which delegation types can act on behalf of the applicant. | `DelegationGuard`, `ApplicationAccessService.isDelegationAllowed` |
| `featureFlag` | ConfigCat feature flag name. If set, the template is only available when the flag is enabled for the user. | `ApplicationTemplateValidationService.isTemplateReady` |
| `translationNamespaces` | CMS translation namespace keys loaded for i18n. Merged with `ApplicationConfigurations[type].translation`. | `getApplicationTranslationNamespaces`, `IntlService` |

**The SDF engine does NOT change how these fields work.** They are read by the same services (`ApplicationTemplateHelper`, `ApplicationAccessService`, `ApplicationLifeCycleService`, `DelegationGuard`) regardless of whether the template uses XState or `defineWorkflow`. The `defineWorkflow` builder only replaces the `stateMachineConfig` construction — everything else on the `ApplicationTemplate` is set by the template author directly.

### B. The Fluent Form Builder API (100% Backwards Compatible)

We will replace the nested DSL with a Fluent Builder API. This new API is purely syntactic sugar built on top of our existing AST. When `.build()` is called, it outputs the exact same legacy `Form` object, making it completely backwards compatible.

```typescript
// libs/application/core/src/builders/FormBuilder.ts
import { Form, FormType } from '@island.is/application/core'

export class FormBuilder<TSchema> {
  private legacyForm: Form

  constructor(id: string, title: string) {
    this.legacyForm = { id, title, type: FormType.DRAFT, children: [] }
  }

  addSection(
    id: string,
    title: string,
    builderFn: (s: SectionBuilder<TSchema>) => void,
  ) {
    const sectionBuilder = new SectionBuilder<TSchema>(id, title)
    builderFn(sectionBuilder)
    this.legacyForm.children.push(sectionBuilder.build())
    return this
  }

  build(): Form {
    return this.legacyForm
  }
}
```

**Developer Experience (DX) Example:**

```typescript
// 1. Single Source of Truth for Data
export const ParentalLeaveSchema = z.object({
  applicantName: z.string().min(2),
  maritalStatus: z.enum(['single', 'married']),
  hasSpouse: z.enum(['yes', 'no']),
  spouseName: z.string().optional(),
  spouseRights: z.string().optional(),
})

// 2. Strict UI Binding with Conditional Field Visibility
export const ParentalLeaveDraftForm = new FormBuilder<
  typeof ParentalLeaveSchema
>('draft', 'Parental Leave')
  .addSection('info', 'Personal Information', (section) => {
    section.addPage('details', 'Your Details', (page) => {
      page
        .addTextField('applicantName', 'Full Name')
        .addRadioField('maritalStatus', 'Status', {
          options: ['single', 'married'],
        })
        .addRadioField('hasSpouse', 'Do you have a spouse?', {
          options: ['yes', 'no'],
        })
        // Tier 1: Simple declarative condition -> auto-emits ClientCondition for instant toggle
        .addTextField('spouseName', "Spouse's name", {
          showWhen: { field: 'hasSpouse', equals: 'yes' },
        })
        // Tier 3: Complex closure condition -> server-only, no ClientCondition emitted
        .addTextField('spouseRights', 'Spouse parental rights', {
          showWhen: (answers, externalData) => {
            const child = getSelectedChild(answers, externalData)
            return child?.parentalRelation === 'primary' && child?.hasSpouse
          },
        })
    })
  })
  .build()
```

#### The `showWhen` Condition API (Three Tiers)

The `showWhen` option on any field controls visibility. The developer never thinks about "client vs. server condition" — the builder infers the correct strategy from what they write.

**Tier 1 — Simple field-to-field check (auto-emits `ClientCondition`):**

```typescript
page.addTextField('spouseName', "Spouse's name", {
  showWhen: { field: 'hasSpouse', equals: 'yes' },
})
```

Under the hood, `PageBuilder` converts this to a `StaticCheck` on the legacy AST (`{ questionId: 'hasSpouse', comparator: Comparators.EQUALS, value: 'yes' }`). The SDF engine sees this is a `StaticCheck` and emits a `ClientCondition` in the GraphQL payload. The frontend toggles the field instantly — no network round-trip.

**Tier 2 — Multi-condition check (also auto-emits `ClientCondition`):**

```typescript
page.addTextField('dependentName', 'Dependent name', {
  showWhen: {
    all: [
      { field: 'hasDependents', equals: 'yes' },
      { field: 'maritalStatus', notEquals: 'single' },
    ],
  },
})
```

Maps to a `MultiConditionCheck` with `on: AllOrAny.ALL` and purely `StaticCheck` sub-checks. The SDF engine emits a `MultiClientCondition` because every sub-check is serializable. The `any` variant is also supported.

**Tier 3 — Complex closure (server-only, no `ClientCondition`):**

```typescript
page.addTextField('spouseRights', 'Spouse parental rights', {
  showWhen: (answers, externalData) => {
    const child = getSelectedChild(answers, externalData)
    return child?.parentalRelation === 'primary' && child?.hasSpouse
  },
})
```

When the developer passes a function, the builder stores it as a `DynamicCheck` — exactly like today. The SDF engine evaluates it server-side and either includes or excludes the field from the `Screen` payload. No `ClientCondition` is emitted. If the user changes an answer that could affect this condition, the frontend sends a `REFETCH` and gets an updated `Screen`.

**Available `showWhen` comparators for Tier 1/2:**

| Shorthand   | Maps To                 | Example                                       |
| ----------- | ----------------------- | --------------------------------------------- |
| `equals`    | `Comparators.EQUALS`    | `{ field: 'status', equals: 'married' }`      |
| `notEquals` | `Comparators.NOT_EQUAL` | `{ field: 'status', notEquals: 'single' }`    |
| `contains`  | `Comparators.CONTAINS`  | `{ field: 'selectedItems', contains: 'car' }` |
| `gt`        | `Comparators.GT`        | `{ field: 'age', gt: 18 }`                    |
| `gte`       | `Comparators.GTE`       | `{ field: 'income', gte: 500000 }`            |
| `lt`        | `Comparators.LT`        | `{ field: 'children', lt: 5 }`                |
| `lte`       | `Comparators.LTE`       | `{ field: 'debt', lte: 0 }`                   |

#### `showWhen` Builder Internals (for implementing agents)

`PageBuilder` resolves `showWhen` into the existing `Condition` type at build time:

```typescript
// libs/application/core/src/builders/PageBuilder.ts

type SimpleCondition = {
  field: string
  equals?: string | number
  notEquals?: string | number
  contains?: string | number
  gt?: number
  gte?: number
  lt?: number
  lte?: number
}

type ShowWhen =
  | SimpleCondition
  | { all: SimpleCondition[] }
  | { any: SimpleCondition[] }
  | DynamicCheck

function resolveShowWhen(showWhen: ShowWhen): Condition {
  if (typeof showWhen === 'function') {
    return showWhen // DynamicCheck — server-only, no ClientCondition emitted
  }

  if ('all' in showWhen || 'any' in showWhen) {
    const checks = 'all' in showWhen ? showWhen.all : showWhen.any
    return {
      isMultiCheck: true,
      show: true,
      on: 'all' in showWhen ? AllOrAny.ALL : AllOrAny.ANY,
      check: checks.map(toStaticCheck),
    }
  }

  return toStaticCheck(showWhen)
}

function toStaticCheck(c: SimpleCondition): StaticCheck {
  const comparator =
    c.equals !== undefined
      ? Comparators.EQUALS
      : c.notEquals !== undefined
      ? Comparators.NOT_EQUAL
      : c.contains !== undefined
      ? Comparators.CONTAINS
      : c.gt !== undefined
      ? Comparators.GT
      : c.gte !== undefined
      ? Comparators.GTE
      : c.lt !== undefined
      ? Comparators.LT
      : c.lte !== undefined
      ? Comparators.LTE
      : Comparators.EQUALS

  const value =
    c.equals ??
    c.notEquals ??
    c.contains ??
    c.gt ??
    c.gte ??
    c.lt ??
    c.lte ??
    ''

  return { questionId: c.field, comparator, value }
}
```

**Key design property:** `showWhen` is pure syntactic sugar. It produces standard `Condition` objects on the legacy AST. The existing `shouldShowFormItem` evaluates them identically — no new runtime path. The `ClientCondition` is extracted separately by the SDF engine as a read-only optimization hint.

### C. The SDF GraphQL Contract

The NestJS backend evaluates the Workflow and the Form, and emits the exact Application Shell and Field parameters. All stringly-typed fields use enums for type safety and LLM-generation compatibility.

```graphql
# apps/application-system/api/src/app/modules/sdf/sdf.graphql

enum ActionType {
  NEXT_PAGE
  PREV_PAGE
  SUBMIT
  REFETCH
  VALIDATE
}

enum ButtonVariant {
  PRIMARY
  GHOST
  SUBTLE
  REJECT
  SIGN
}

type Screen {
  applicationId: String!
  header: Header!
  stepper: Stepper!
  page: Page!
  footer: Footer!
  locale: String!
}

type Header {
  title: String!
  description: String
}

type Stepper {
  sections: [StepperSection!]!
  activeSectionIndex: Int!
  activeSubSectionIndex: Int!
}

type StepperSection {
  id: String!
  title: String!
  isComplete: Boolean!
  children: [StepperSubSection!]!
}

type StepperSubSection {
  id: String!
  title: String!
}

type Footer {
  buttons: [FooterButton!]!
  canGoBack: Boolean!
}

type FooterButton {
  id: String!
  text: String!
  variant: ButtonVariant!
  actionType: ActionType!
}

type Page {
  id: String!
  index: Int!
  sectionIndex: Int!
  subSectionIndex: Int!
  components: [Component!]!
  errors: [ValidationError!]!
}

type ValidationError {
  componentId: String!
  message: String!
}

# --- Component Union ---
# Every field type from the existing fieldBuilders.ts must have a corresponding type here.
# The implementing agent MUST enumerate all types from FieldTypes in
# libs/application/types/src/lib/Fields.ts

union Component =
    TextField
  | SelectField
  | RadioField
  | CheckboxField
  | DateField
  | FileUploadField
  | PhoneField
  | NationalIdField
  | CompanySearchField
  | AsyncSelectField
  | SubmitField
  | DividerField
  | DescriptionField
  | KeyValueField
  | AlertMessageField
  | LinkField
  | RedirectToServicePortalField
  | PaymentPendingField
  | MessageWithLinkButtonField
  | ExpandableDescriptionField
  | AccordionField
  | ActionCardListField
  | TableRepeaterField
  | StaticTableField
  | HiddenInputField
  | HiddenInputWithWatchedValueField
  | FindVehicleField
  | DisplayField
  | ImageField
  | BankAccountField
  | SliderField
  | RepeaterComponent
  | CustomComponent

# Repeater: models dynamic array-based sub-forms (e.g., "add another employer period")
type RepeaterComponent {
  id: String!
  arrayPath: String!
  addItemLabel: String!
  removeItemLabel: String
  minItems: Int
  maxItems: Int
  items: [[Component!]!]!
}

type CustomComponent {
  componentName: String!
  props: String!
}

# ... each standard component type has its own type definition with specific props.
# Example:
type TextField {
  id: String!
  label: String!
  placeholder: String
  required: Boolean!
  disabled: Boolean!
  maxLength: Int
  defaultValue: String
  width: ComponentWidth
  # Client-side condition hint for instant field toggling without server round-trip.
  # Only populated for StaticCheck-style conditions. DynamicCheck (closure) conditions
  # are evaluated server-side and reflected in component presence/absence.
  clientCondition: ClientCondition
}

enum ComponentWidth {
  FULL
  HALF
}

# Lightweight declarative condition the frontend can evaluate locally.
# Supports single checks (Tier 1) and multi-checks (Tier 2).
# Not emitted for DynamicCheck closures (Tier 3) — those are server-only.
union ClientCondition = SingleClientCondition | MultiClientCondition

type SingleClientCondition {
  questionId: String!
  comparator: String!
  value: String!
}

type MultiClientCondition {
  on: ConditionOperator!
  checks: [SingleClientCondition!]!
}

enum ConditionOperator {
  ALL
  ANY
}
```

**Implementation note on i18n:** All text fields in the `Screen` payload (`header.title`, `btn.text`, field `label`, `placeholder`, `error.message`, etc.) are **resolved to the user's locale on the server**. The SDF engine calls `formatMessage` with the application's `MessageDescriptor` values and the request locale. The frontend never needs `react-intl` for form content — it renders pre-resolved strings. The `Screen.locale` field tells the frontend which locale was used.

### D. The "Dumb" Next.js Application Shell

The frontend uses App Router Server Components for instantaneous first-loads, passing the UI definition to a client renderer. Business logic is strictly prohibited here.

```typescript
// apps/application-system-next/app/umsoknir/[id]/page.tsx
import { Suspense } from 'react'
import { fetchScreen } from '@/lib/graphql'
import { ApplicationShell } from '@/components/ApplicationShell'
import { ShellSkeleton } from '@/components/ShellSkeleton'

export default async function ApplicationPage({ params, searchParams }) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <ApplicationContent id={params.id} step={searchParams.step} />
    </Suspense>
  )
}

async function ApplicationContent({ id, step }) {
  const screen = await fetchScreen(id, step)
  return <ApplicationShell applicationId={id} screen={screen} />
}
```

```typescript
// apps/application-system-next/components/ApplicationShell.tsx
'use client'
import { executeAction } from '@/actions'

export function ApplicationShell({ applicationId, screen }) {
  const handleAction = async (actionType: string, answers: any) => {
    await executeAction(applicationId, actionType, answers)
  }

  return (
    <div className="layout">
      <Stepper
        items={screen.stepper.sections}
        active={screen.stepper.activeSectionIndex}
      />
      <main>
        <h1>{screen.header.title}</h1>
        <FormRenderer
          components={screen.page.components}
          errors={screen.page.errors}
        />
        <footer>
          {screen.footer.buttons.map((btn) => (
            <Button
              key={btn.id}
              variant={btn.variant}
              onClick={() => handleAction(btn.actionType, currentAnswers)}
            >
              {btn.text}
            </Button>
          ))}
        </footer>
      </main>
    </div>
  )
}
```

**Implementation note:** Use `<Suspense>` with a `<ShellSkeleton>` so the page shell renders instantly while the NestJS backend computes the `Screen`. This prevents blank-page cold-start latency.

---

## 5. The AstAdapter: Legacy-to-SDF Bridge (Critical Path)

The `AstAdapter` is the most important component of the migration. It takes an existing legacy `Form` AST (built with `buildForm`/`buildSection`) and an XState state machine config, and produces a valid `Screen` GraphQL payload entirely server-side. This enables legacy templates to be served by the new Next.js frontend _without rewriting them_.

### 5.1. Core Principle: Extract and Reuse, Don't Rewrite

The current frontend rendering pipeline lives in `libs/application/ui-shell/src/reducer/reducerUtils.ts`. The key function `convertFormToScreens` already does exactly what the SDF engine needs:

- Takes a `Form` tree + `answers` + `externalData` + `user`
- Walks the entire tree recursively via `convertFormNodeToScreens`
- Evaluates `shouldShowFormItem` (conditions) at every node
- Expands `Repeater` nodes into indexed child screens
- Assigns `sectionIndex` / `subSectionIndex` to every screen
- Produces a flat `FormScreen[]` array with `isNavigable` resolved

**The AstAdapter MUST reuse this logic, not reimplement it.** The implementation approach:

1. **Extract** the pure-logic functions from `libs/application/ui-shell/src/reducer/reducerUtils.ts` into a new shared library `libs/application/screen-compiler`. These functions have zero React imports — they are pure data transformations.
2. **Extract** the validation scoping logic from `libs/application/ui-shell/src/validation/resolver.ts` (specifically `getFormNodeFieldIds`) into the same library.
3. **The SDF engine calls `convertFormToScreens`** on the server and then maps the resulting `FormScreen[]` to the GraphQL `Screen` type.

This guarantees **behavioral parity** with the legacy SPA. Both code paths call the same tree-walking, condition-evaluating, repeater-expanding logic.

### 5.2. System Architecture: Two-Layer Design (REST + GraphQL Gateway)

To stay inline with the island.is technical direction, the SDF system follows the same two-layer pattern as the existing application system: REST endpoints on `application-system-api`, with GraphQL resolvers in the shared API gateway domain (`libs/api/domains/application/`).

```
┌─────────────────────────────────────────────────────────────────────┐
│  Next.js Frontend (application-system-next)                        │
│    fetchScreen(id, step) via GraphQL                               │
│    executeAction(id, actionType, answers) via GraphQL              │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ GraphQL
┌──────────────────────────▼──────────────────────────────────────────┐
│  GraphQL Gateway (api.islandis.svc.cluster.local)                  │
│    libs/api/domains/application/src/lib/                           │
│      sdf.resolver.ts          <-- NEW: getScreen, executeAction    │
│      sdf.service.ts           <-- NEW: calls REST via SdfApi       │
│      sdf.model.ts             <-- NEW: Screen, Component GQL types │
│      application.module.ts    <-- MODIFIED: registers SdfApi       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ REST (HTTP)
┌──────────────────────────▼──────────────────────────────────────────┐
│  application-system-api (NestJS)                                   │
│    apps/application-system/api/src/app/modules/sdf/                │
│      sdf.module.ts            <-- NestJS module                    │
│      sdf.controller.ts        <-- NEW REST endpoints:              │
│                                   GET  /sdf/:id/screen?step=&locale= │
│                                   POST /sdf/:id/action             │
│      ast-adapter.service.ts   <-- Orchestrator (see §5.3)         │
│      screen-mapper.ts         <-- FormScreen -> Screen DTO mapping │
│      footer-builder.ts        <-- CallToAction[] -> FooterButton[] │
│      stepper-builder.ts       <-- Section[] -> Stepper mapping     │
│      i18n-resolver.service.ts <-- FormText -> resolved string      │
│      condition-hint.ts        <-- StaticCheck -> ClientCondition   │
│      dto/                     <-- Request/Response DTOs for REST   │
│        screen.dto.ts                                               │
│        action.dto.ts                                               │
└─────────────────────────────────────────────────────────────────────┘
```

**Why two layers (not a direct GraphQL endpoint on application-system-api):**

- The island.is architecture mandates all client-facing GraphQL goes through the shared gateway. Frontend apps call `api.islandis.svc.cluster.local`, not individual backend services.
- The existing application resolvers (`application.resolver.ts`, `applicationV2.resolver.ts`) already follow this pattern — thin GraphQL resolvers that call `ApplicationsApi` (a generated fetch client) to reach the REST backend.
- The SDF resolver follows the same pattern: `SdfService` in the gateway calls `SdfApi` (generated from the new REST OpenAPI spec) to reach `sdf.controller.ts` on `application-system-api`.

**Library structure:**

```
libs/application/screen-compiler/        <-- NEW library, environment-neutral (no React, no Node APIs)
  src/
    index.ts                             <-- Public API barrel export
    convertFormToScreens.ts              <-- Extracted from ui-shell/reducer/reducerUtils.ts
    getNavigableSections.ts              <-- Extracted from ui-shell/reducer/reducerUtils.ts
    moveToScreen.ts                      <-- Screen navigation logic
    screenFieldIds.ts                    <-- Extracted from ui-shell/validation/resolver.ts
    types.ts                             <-- FormScreen, FieldDef, MultiFieldScreen, RepeaterScreen, ExternalDataProviderScreen
  project.json                           <-- Nx project config, no React dependency

libs/application/sdf-types/             <-- NEW library, graphql-codegen output
  src/
    generated/                           <-- Auto-generated from sdf.graphql schema
      screen.ts
      enums.ts
    index.ts
  codegen.yml                            <-- graphql-codegen config
  project.json                           <-- Nx target: "generate" runs codegen

libs/api/domains/application/            <-- EXISTING library, MODIFIED
  src/lib/
    sdf.resolver.ts                      <-- NEW: GraphQL resolver for Screen queries/mutations
    sdf.service.ts                       <-- NEW: calls application-system-api REST via SdfApi
    sdf.model.ts                         <-- NEW: Screen, Component, Footer etc. GQL object types
    application.module.ts                <-- MODIFIED: register SdfResolver, SdfService, SdfApi provider
  src/gen/fetch/                         <-- MODIFIED: regenerate to include SDF REST endpoints

apps/application-system/api/
  src/app/modules/sdf/
    sdf.module.ts                        <-- NestJS module, registered alongside existing ApplicationModule
    sdf.controller.ts                    <-- REST controller: GET /sdf/:id/screen, POST /sdf/:id/action
    ast-adapter.service.ts               <-- Orchestrator service (see §5.3)
    screen-mapper.ts                     <-- FormScreen -> REST DTO mapping
    footer-builder.ts                    <-- CallToAction[] -> FooterButton[] mapping
    stepper-builder.ts                   <-- Section[] -> Stepper payload mapping
    i18n-resolver.service.ts             <-- FormText -> resolved string (using formatMessage + locale)
    condition-hint.ts                    <-- StaticCheck -> ClientCondition extraction
    dto/
      screen.dto.ts                      <-- Swagger-decorated response DTO (generates OpenAPI spec)
      action.dto.ts                      <-- Swagger-decorated request DTO
```

**The REST endpoints on `application-system-api`:**

| Method | Path                                          | Description                                                                                                                                                                                                                                                     |
| ------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/sdf/:applicationId/screen?step=N&locale=is` | Returns the `Screen` DTO for the given page index. The `AstAdapterService` computes the full payload.                                                                                                                                                           |
| `POST` | `/sdf/:applicationId/action`                  | Receives `{ actionType, answers, locale }`. Handles `NEXT_PAGE` (validate + persist + return next screen), `PREV_PAGE` (return previous screen), `SUBMIT` (trigger state transition + return screen), `REFETCH` (ephemeral evaluation + return updated screen). |

**The GraphQL resolvers in `libs/api/domains/application/`:**

```typescript
// libs/api/domains/application/src/lib/sdf.resolver.ts
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class SdfResolver {
  constructor(private sdfService: SdfService) {}

  @Query(() => Screen, { name: 'applicationSdfScreen' })
  async getScreen(
    @Args('input') input: GetScreenInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Screen> {
    return this.sdfService.getScreen(
      input.applicationId,
      input.step,
      locale,
      user,
    )
  }

  @Mutation(() => Screen, { name: 'applicationSdfAction' })
  async executeAction(
    @Args('input') input: ExecuteActionInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Screen> {
    return this.sdfService.executeAction(
      input.applicationId,
      input.actionType,
      input.answers,
      locale,
      user,
    )
  }
}
```

```typescript
// libs/api/domains/application/src/lib/sdf.service.ts
@Injectable()
export class SdfService {
  constructor(private sdfApi: SdfApi) {}

  sdfApiWithAuth(auth: Auth) {
    return this.sdfApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getScreen(
    applicationId: string,
    step: number,
    locale: Locale,
    auth: Auth,
  ) {
    return this.sdfApiWithAuth(auth).sdfControllerGetScreen({
      applicationId,
      step,
      locale,
    })
  }

  async executeAction(
    applicationId: string,
    actionType: string,
    answers: Record<string, unknown>,
    locale: Locale,
    auth: Auth,
  ) {
    return this.sdfApiWithAuth(auth).sdfControllerExecuteAction({
      applicationId,
      executeActionDto: { actionType, answers, locale },
    })
  }
}
```

The `SdfApi` fetch client is auto-generated from the OpenAPI spec of `sdf.controller.ts` (same pattern as the existing `ApplicationsApi` and `PaymentsApi`).

### 5.3. AstAdapter Service — Step-by-Step Pipeline

The `AstAdapterService` is a NestJS injectable that produces a `Screen` from any application. Here is the exact sequence:

```
Input: (applicationId: string, pageIndex: number, locale: string, user: BffUser)
Output: Screen (GraphQL type)

Step 1: Load Application
  └─ ApplicationService.findOneById(applicationId)
  └─ Returns: Application { id, typeId, state, answers, externalData }

Step 2: Load Template
  └─ getApplicationTemplateByTypeId(application.typeId)
  └─ Returns: ApplicationTemplate { stateMachineConfig, dataSchema, mapUserToRole, ... }

Step 3: Resolve Role & Form
  └─ template.mapUserToRole(user.nationalId, application) -> role
  └─ ApplicationTemplateHelper.getApplicationStateInformation() -> stateInfo
  └─ stateInfo.roles.find(r => r.id === role) -> roleInState
  └─ roleInState.formLoader({ featureFlagClient }) -> Form (legacy AST)
  └─ IMPORTANT: formLoader requires a server-side FeatureFlagClient.
     Use the existing NestJS FeatureFlagService, not the React client.

Step 3.5: Apply Role-Based Data Filtering (SECURITY-CRITICAL)
  └─ Clone `answers` and `externalData` from the application.
  └─ Read `roleInState.read` (ReadWriteValues: per-field answer paths and externalData paths).
  └─ Strip any keys NOT listed in the role's read permissions from the cloned objects.
  └─ All subsequent steps (form compilation, screen mapping, component props) operate
     on the filtered copies. This prevents data leakage — e.g., an assignee's Screen
     payload will never contain applicant-only fields like bank accounts or nationalId.
  └─ If `roleInState.read === 'all'`, skip filtering (applicant in draft phase).

Step 4: Compile Form to Screens (REUSED from screen-compiler)
  └─ convertFormToScreens(form, filteredAnswers, filteredExternalData, user) -> FormScreen[]
  └─ This evaluates ALL conditions (including DynamicCheck closures) server-side.
     Closures execute in Node.js with the filtered answers/externalData/user.

Step 5: Resolve Current Screen
  └─ screens[pageIndex] (or findCurrentScreen(screens, answers) if no pageIndex)
  └─ moveToScreen(screens, pageIndex, true) to skip non-navigable screens

Step 6: Build Stepper
  └─ getNavigableSectionsInForm(form, answers, externalData, user) -> Section[]
  └─ Map each Section to StepperSection { id, title, isComplete, children }
  └─ isComplete = currentScreen.sectionIndex > section's index

Step 7: Build Page
  └─ Map the current FormScreen to Page.components using screen-mapper:
     - FieldDef (single field) -> map field.type to Component union member
     - MultiFieldScreen -> map each child to a Component
     - RepeaterScreen -> map to RepeaterComponent with expanded items
     - ExternalDataProviderScreen -> map to data consent Component
  └─ Resolve ALL FormText values (labels, placeholders, descriptions, options)
     to strings using i18n-resolver with the request locale.
  └─ For fields with StaticCheck conditions, emit clientCondition hints.
     For fields with DynamicCheck (closure) conditions, omit clientCondition
     (the server already resolved visibility via isNavigable).

Step 8: Build Footer
  └─ roleInState.actions (CallToAction[]) -> evaluate each action's condition
  └─ Map to FooterButton[] { id, text (resolved), variant, actionType }
  └─ canGoBack = canGoBack(screens, currentScreenIndex)

Step 9: Build Header
  └─ form.title (resolved to locale string)
  └─ currentScreen section/subsection title

Step 10: Assemble & Return Screen
  └─ { applicationId, header, stepper, page, footer, locale }
```

### 5.4. Handling DynamicCheck Conditions

The existing `Condition` type (`libs/application/types/src/lib/Condition.ts`) allows JavaScript closures as conditions:

```typescript
export type DynamicCheck = (
  formValue: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
) => boolean
```

Across the ~90 templates, **120+ files** use closure-style `condition: (answers) => ...` on form items.

**Strategy:** The AstAdapter handles these by **executing closures server-side, not serializing them.**

- `shouldShowFormItem` already calls closures: `if (typeof condition === 'function') { return condition(formValue, externalData, user) }`. This works identically in Node.js.
- The result is reflected in `isNavigable: true/false` on each `FormScreen`. Non-navigable items are excluded from the `Screen` payload.
- **Edge case — intra-page reactivity:** In the current SPA, `ConditionHandler` uses `react-hook-form`'s `useWatch` to toggle field visibility within a `MultiField` when the user changes a value. In the SDF model, this becomes a REFETCH round-trip. For legacy templates served via the AstAdapter, **always use server round-trips for intra-page condition changes.** For new Fluent API templates, optionally emit a `ClientCondition` hint (the `StaticCheck` subset) for instant client-side toggle.

### 5.5. Handling Repeaters

The `convertRepeaterToScreens` function in `reducerUtils.ts` expands repeaters by:

1. Reading the array value from answers: `getValueViaPath(answers, id, [])`
2. For each array entry `i`, cloning child fields with indexed IDs: `${id}[${i}].${childField.id}`
3. Producing `1 + (N * M)` screens (1 repeater header + N items \* M fields per item)

The `screen-mapper` maps this to the `RepeaterComponent` GraphQL type:

```typescript
{
  id: repeater.id,
  arrayPath: repeater.id,
  addItemLabel: resolveFormText(repeater.addItemLabel, locale),
  removeItemLabel: resolveFormText(repeater.removeItemLabel, locale),
  minItems: repeater.minItems,
  maxItems: repeater.maxItems,
  items: expandedChildGroups.map(group =>
    group.map(field => mapFieldToComponent(field))
  ),
}
```

The frontend renders this as a dynamic list with add/remove controls. Partial validation must handle indexed paths like `employers[2].name`.

### 5.6. Handling Custom Fields (`FieldTypes.CUSTOM`)

The AstAdapter **MUST NOT import React component implementations**. Custom fields in the legacy system are loaded via `getApplicationUIFields` which returns React components — these are frontend-only.

The adapter handles custom fields by:

1. Reading the `component` string identifier and `props` from the field definition.
2. Emitting a `CustomComponent { componentName, props }` in the GraphQL payload.
3. The Next.js frontend uses a dynamic component registry to render:
   ```typescript
   const registry = {
     ParentalTimeline: dynamic(
       () => import('@island.is/application/ui-fields/ParentalTimeline'),
     ),
     // ...
   }
   ```

**Security constraint:** Custom components that write to the answers store MUST go through the `executeAction` server action. The frontend MUST NOT allow custom components to write answers directly to local state that bypasses server validation on the next `NEXT_PAGE`.

---

## 6. Handling Complex Scenarios (Preventing "Boxing In")

### 6.1. Dynamic External Data (`REFETCH`)

If a user selects a vehicle from a dropdown, the UI must update to show that vehicle's specific debt.

- **Solution:** The dropdown field emits a `REFETCH` action. NestJS receives the delta, executes the `VehicleDebtApi` integration, updates the `externalData` JSON in PostgreSQL, re-evaluates the Fluent Form conditions, and returns the updated `Screen` object. Next.js simply diffs the DOM and updates.

### 6.2. Custom Bespoke Components (The Escape Hatch)

For highly interactive UI (e.g., Parental Leave Timeline allocation).

- The builder uses `.addCustomComponent('ParentalTimeline', { props: (answers) => ({ maxDays: 180 }) })`.
- The GraphQL payload returns `CustomComponent { componentName: 'ParentalTimeline', props: '{"maxDays": 180}' }`.
- Next.js uses its dynamic component registry to render it.
- **Security rule:** Custom component answer writes MUST flow through `executeAction` (a Next.js Server Action that calls the NestJS API). This prevents a malicious/modified frontend from injecting arbitrary answers that bypass server-side Zod validation.

### 6.3. Server-Side Partial Validation

On `NEXT_PAGE` or `VALIDATE (onBlur)`, NestJS validates only the keys present on the current page's AST using the scoped field IDs from `getFormNodeFieldIds`. If validation fails, NestJS halts the transition and returns the current `Screen` populated with an `errors` array mapped to the `componentId`.

### 6.4. Repeater Fields (Dynamic Array Forms)

For forms that allow adding/removing groups of fields (e.g., "add another employer period" in parental leave):

- The `RepeaterComponent` type in the GraphQL schema models the array structure with `items: [[Component!]!]!` (array of component groups).
- The frontend renders add/remove controls using `addItemLabel` / `removeItemLabel`.
- On add: the frontend sends a `REFETCH` action with the updated array length. The backend re-evaluates `convertRepeaterToScreens` and returns the expanded `Screen`.
- Partial validation uses indexed paths (e.g., `employers[2].name`) scoped to the current page's field IDs.

### 6.5. Intra-Page Field Reactivity (ClientCondition System)

When field B's visibility depends on field A's value within the same page, the system uses a three-tier approach. The developer controls which tier is used via the `showWhen` syntax (see §4B); the SDF engine and frontend handle the rest automatically.

#### Tier Summary

| Tier           | Condition Source                               | `ClientCondition` Emitted?    | Frontend Behavior    | Latency    |
| -------------- | ---------------------------------------------- | ----------------------------- | -------------------- | ---------- |
| **1: Simple**  | `showWhen: { field, equals }`                  | Yes (`SingleClientCondition`) | Instant local toggle | 0ms        |
| **2: Multi**   | `showWhen: { all: [...] }` or `{ any: [...] }` | Yes (`MultiClientCondition`)  | Instant local toggle | 0ms        |
| **3: Closure** | `showWhen: (answers, externalData) => ...`     | No                            | REFETCH round-trip   | ~200-500ms |

#### How `ClientCondition` is Extracted (SDF Engine: `condition-hint.ts`)

When the `AstAdapterService` maps a field to a GraphQL `Component`, it inspects the field's `condition` property from the legacy AST:

```typescript
// apps/application-system/api/src/app/modules/sdf/condition-hint.ts

import { Condition, StaticCheck } from '@island.is/application/types'

export function extractClientCondition(
  condition?: Condition,
): ClientCondition | null {
  if (!condition) return null
  if (typeof condition === 'function') return null // Tier 3: DynamicCheck — can't serialize

  if (condition.isMultiCheck) {
    // Only emit if ALL sub-checks are StaticChecks (no closures mixed in)
    if (condition.check.some((c) => typeof c === 'function')) return null
    return {
      type: 'multi',
      on: condition.on,
      checks: (condition.check as StaticCheck[]).map(staticCheckToHint),
    }
  }

  // Tier 1: single StaticCheck
  return staticCheckToHint(condition as StaticCheck)
}

function staticCheckToHint(check: StaticCheck): SingleClientCondition {
  return {
    questionId:
      check.questionId ?? check.externalDataId ?? check.userPropId ?? '',
    comparator: check.comparator,
    value: String(check.value),
  }
}
```

**Critical rule:** If a `MultiConditionCheck` contains even one `DynamicCheck` closure among its sub-checks, the entire condition falls back to server-only. No partial emission — that would risk the client and server disagreeing on visibility.

#### How `ClientCondition` is Evaluated (Frontend: `evaluateClientCondition.ts`)

The Next.js `FormRenderer` reads `clientCondition` on each component and evaluates it locally using a small, pure function (~30 lines):

```typescript
// apps/application-system-next/lib/evaluateClientCondition.ts

type SingleCheck = { questionId: string; comparator: string; value: string }
type MultiCheck = { type: 'multi'; on: 'all' | 'any'; checks: SingleCheck[] }
type ClientCondition = SingleCheck | MultiCheck

export function evaluateClientCondition(
  condition: ClientCondition | null | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!condition) return true // No condition = always visible

  if ('type' in condition && condition.type === 'multi') {
    const results = condition.checks.map((c) => evaluateSingle(c, answers))
    return condition.on === 'all'
      ? results.every(Boolean)
      : results.some(Boolean)
  }

  return evaluateSingle(condition as SingleCheck, answers)
}

function evaluateSingle(
  check: SingleCheck,
  answers: Record<string, unknown>,
): boolean {
  const actual = answers[check.questionId]
  const expected = check.value

  switch (check.comparator) {
    case 'eq':
      return actual === expected
    case 'neq':
      return actual !== expected
    case 'gt':
      return Number(actual) > Number(expected)
    case 'gte':
      return Number(actual) >= Number(expected)
    case 'lt':
      return Number(actual) < Number(expected)
    case 'lte':
      return Number(actual) <= Number(expected)
    case 'in':
      return Array.isArray(actual) && actual.includes(expected)
    case 'nin':
      return Array.isArray(actual) && !actual.includes(expected)
    default:
      return true
  }
}
```

This runs synchronously on every field change within the page — no network, no debounce, instant UI response. It mirrors the same logic as `applyStaticConditionalCheck` in `libs/application/core/src/lib/conditionUtils.ts`.

#### Why This Doesn't Box Us In

**`ClientCondition` is a performance optimization, not a behavioral mechanism.** The server always evaluates the full condition (closure or static) and returns the authoritative `Screen`. The `ClientCondition` lets the frontend optimistically toggle visibility between server round-trips. If the client-side evaluation is ever wrong (stale data, race condition), the next server response corrects it.

This means:

- **Legacy templates** via the AstAdapter never get `ClientCondition` (their closures can't be serialized) — everything is server round-trips. Correct, just slower.
- **New Fluent API templates** with `showWhen: { field, equals }` get instant toggle for free.
- A developer can always escape to a closure when the logic is too complex. They just lose the instant toggle — which is the correct tradeoff.

#### Current Codebase Context

In the existing ~90 templates, **~99% of conditions are closures** (`condition: (answers) => ...`). Only 3 files use the declarative `StaticCheck` / `Comparators` pattern. This is because the closure syntax was always more natural TypeScript. The `showWhen` API solves this DX problem — it makes the simple declarative path the path of least resistance, while keeping closures available for complex logic.

---

## 7. Migration & Rollout Strategy: The Strangler Fig

We cannot rewrite 90+ applications overnight. We will use the Strangler Fig Pattern.

### 7.1. Template Registration: Where New Applications Live

New SDF-native templates live in the **same location** as legacy templates: `libs/application/templates/<name>/`. They are not in a separate directory. The `FormBuilder.build()` output is the same `Form` AST the legacy system uses — the template registration mechanism is identical.

Registering a new template (or migrating an existing one to SDF) touches **four files**:

**1. `ApplicationTypes` enum** — `libs/application/types/src/lib/ApplicationTypes.ts`

Add the type ID string (skip this step if migrating an existing template — it already has one):

```typescript
export enum ApplicationTypes {
  // ... existing entries ...
  DOG_LICENSE = 'DogLicense', // <-- new entry
}
```

**2. `ApplicationConfigurations`** — same file, below the enum

Add slug, translation namespace, and the **`useSdf` flag**:

```typescript
export const ApplicationConfigurations = {
  // ... existing entries ...
  [ApplicationTypes.DOG_LICENSE]: {
    slug: 'dog-license',
    translation: 'dl.application',
    useSdf: true, // <-- Routes to Next.js frontend via SDF engine
  },
  // For migrating an existing template, just add useSdf: true to its existing entry:
  [ApplicationTypes.PARENTAL_LEAVE]: {
    slug: 'parental-leave',
    translation: 'pl.application',
    useSdf: true, // <-- Existing template, now routed to SDF
  },
}
```

The `useSdf` flag is the **sole routing switch**. When `true`, the ingress/BFF layer routes traffic for this template to `application-system-next`. When `false` or absent, traffic goes to the legacy SPA. This is cleaner than URL-path-based routing and leverages the existing configuration pattern (`readyForProduction` checks in the template loader already read `ApplicationConfigurations`).

**3. `templateLoaders`** — `libs/application/template-loader/src/lib/templateLoaders.ts`

Add the dynamic import mapping:

```typescript
const templates: Record<ApplicationTypes, () => Promise<unknown>> = {
  // ... existing entries ...
  [ApplicationTypes.DOG_LICENSE]: () =>
    import('@island.is/application/templates/dog-license'),
}
```

**4. The template library itself** — `libs/application/templates/<name>/`

```
libs/application/templates/dog-license/     <-- Same structure as any legacy template
  src/
    index.ts                                <-- Default export: ApplicationTemplate
    lib/
      template.ts                           <-- defineWorkflow (new) OR stateMachineConfig (legacy)
      dataSchema.ts                         <-- Zod schema (identical to today)
    forms/
      DraftForm.ts                          <-- FormBuilder with showWhen (new) OR buildForm (legacy)
    dataProviders/                          <-- Same as today
    fields/                                 <-- Custom fields (same as today, escape hatches only)
  project.json
```

The only structural difference between a new SDF template and a legacy template is:

- `template.ts` uses `defineWorkflow` instead of raw XState `stateMachineConfig`
- `forms/` use `FormBuilder` with `showWhen` instead of `buildForm` with nested children
- Both produce the same `ApplicationTemplate` and `Form` types — the rest of the system sees no difference

### 7.2. URL Routing & Template Loading — How SDF Knows What to Render

This section addresses a critical implementation gap: how a browser URL like `/umsoknir/parental-leave` resolves to the correct SDF backend and loads the correct template.

#### Current Flow (Legacy SPA)

```
1. User visits /umsoknir/parental-leave
2. Ingress routes /umsoknir/* to application-system-form (React SPA)
3. React Router extracts slug "parental-leave" from URL params
4. getTypeFromSlug("parental-leave") iterates ApplicationConfigurations
   → returns ApplicationTypes.PARENTAL_LEAVE
5. getApplicationTemplateByTypeId(ApplicationTypes.PARENTAL_LEAVE)
   → looks up templateLoaders[typeId]
   → dynamic import('@island.is/application/templates/parental-leave')
   → returns the ApplicationTemplate (stateMachineConfig + form loader)
6. SPA creates XState machine, calls formLoader, renders locally
```

Key files in this flow:
- `libs/application/core/src/lib/configurationUtils.ts` — `getTypeFromSlug` / `getSlugFromType`
- `libs/application/template-loader/src/index.ts` — `getApplicationTemplateByTypeId`, `loadTemplateLib`
- `libs/application/template-loader/src/lib/templateLoaders.ts` — dynamic import map

#### New Flow (SDF)

```
1. User visits /umsoknir/parental-leave
2. Ingress checks ApplicationConfigurations["parental-leave"].useSdf
   → true: routes to application-system-next (Next.js)
   → false/absent: routes to application-system-form (legacy SPA)
3. Next.js extracts slug from URL params
4. Next.js calls GraphQL: getScreen(applicationId, step, locale)
5. GQL Gateway calls REST: GET /sdf/:id/screen?step=&locale=
6. SDF Controller in application-system-api:
   a. Loads application from DB → gets typeId from the application row
   b. getApplicationTemplateByTypeId(typeId) → loads template
   c. Template provides: defineWorkflow phases, formLoader, dataSchema,
      mapUserToRole, adminDataConfig, lifecycle, roles, etc.
   d. AstAdapterService compiles Screen payload
7. Next.js renders Screen
```

#### What Must Be Refactored

**`getApplicationTemplateByTypeId`** currently returns a `TemplateLibraryModule` that is typed for the legacy `ApplicationTemplate` interface (with XState `stateMachineConfig`). For SDF templates using `defineWorkflow`:

1. **`defineWorkflow` must compile to the same `ApplicationTemplate` shape.** This is the cleanest path — `defineWorkflow` is a builder that _produces_ a `stateMachineConfig` and `ApplicationStateMeta`. The `getApplicationTemplateByTypeId` function sees no difference. The template's `default` export is still an `ApplicationTemplate`.

2. **The `templateLoaders` map does NOT need a second map for SDF.** Both legacy and SDF templates live in `libs/application/templates/<name>/` and export the same interface. The existing `templateLoaders.ts` dynamic import map works as-is.

3. **The routing decision (`useSdf`) happens at the ingress/BFF layer**, NOT inside `getApplicationTemplateByTypeId`. The backend always loads templates the same way. Only the frontend changes.

4. **New SDF-only query path.** When the SDF controller receives `GET /sdf/:id/screen`, it already has the `applicationId`. It loads the `Application` row from the DB (which has `typeId`), then calls `getApplicationTemplateByTypeId(typeId)`. This is identical to how the current `application.controller.ts` loads templates. No new lookup mechanism is needed.

### 7.3. Implementation Phases — Ordered Agent Actions

Each phase is a dependency chain. Actions within a phase can be parallelized. Actions across phases are sequential — a later phase depends on the outputs of the earlier one.

#### Phase 1: Foundation (Types, Screen Compiler, defineWorkflow)

These are leaf libraries with no runtime dependencies on each other.

| Step | Action | Output |
|------|--------|--------|
| 1.1 | Create `libs/application/screen-compiler`. Extract pure functions from `libs/application/ui-shell/src/reducer/reducerUtils.ts`: `convertFormToScreens`, `getNavigableSectionsInForm`, `moveToScreen`, `findCurrentScreen`, `canGoBack`, `convertRepeaterToScreens`, `convertMultiFieldToScreen`. Also extract `shouldShowFormItem` from `libs/application/core/src/lib/conditionUtils.ts` and `getFormNodeFieldIds` from `libs/application/ui-shell/src/validation/resolver.ts`. | `@island.is/application/screen-compiler` library |
| 1.2 | Create `libs/application/sdf-types`. Define GraphQL schema (`sdf.graphql`) from §4C. Configure `graphql-codegen` as an Nx target. Generate TypeScript types. Ensure zero execution logic. This library MUST also export a `SdfComparators` constant map that is the single source of truth for comparator strings (e.g., `EQUALS → 'eq'`, `NOT_EQUAL → 'neq'`). Both backend `condition-hint.ts` and frontend `evaluateClientCondition.ts` MUST import from here — see §8, Constraint 12. | `@island.is/application/sdf-types` library |
| 1.3 | Implement `defineWorkflow` in `libs/application/core`. The builder MUST produce a valid `ApplicationTemplate` object — same shape as the XState-based templates. All `ApplicationStateMeta` fields listed in §4A must be first-class. Write unit tests that verify the output matches a known XState config. | `defineWorkflow` function in `@island.is/application/core` |
| 1.4 | Implement `FormBuilder` / `PageBuilder` fluent API in `libs/application/core`. `FormBuilder.build()` must return a `Form` AST identical to `buildForm()` output. Write unit tests that verify structural equivalence. | `FormBuilder` classes in `@island.is/application/core` |
| 1.5 | Add `useSdf?: boolean` to the `ApplicationConfigurations` type in `libs/application/types/src/lib/ApplicationTypes.ts`. | Type update only — no runtime changes |

**Phase 1 Gate — the following MUST pass before merging any Phase 1 PR:**

1. **Zero React in screen-compiler.** Run `rg "from 'react'|from \"react\"" libs/application/screen-compiler/` — must return zero results. Manually audit every transitive import from `reducerUtils.ts` through `../types` and `../utils` barrel files to confirm no React-dependent sibling re-exports leak in. Do NOT rely solely on `nx dep-graph` — it can miss type-only re-exports. (§8, Constraint 7)
2. **Nx boundary lint passes.** Verify `.eslintrc.json` has an `@nx/enforce-module-boundaries` constraint that forbids `type:util` from importing `type:ui` or `type:feature`. If the rule doesn't exist, add it. Run `nx lint screen-compiler` — must report zero boundary violations. (§8, Constraint 16)
3. **defineWorkflow golden-file test.** Take the actual `parental-leave` XState `stateMachineConfig`, write its `defineWorkflow` equivalent, and assert both produce structurally identical `ApplicationStateMeta` for every state. This test runs in CI and blocks merge on divergence. (§8, Constraint 8)
4. **FeatureFlagClient type assertion.** Add a compile-time assertion test in `screen-compiler` or `application/core`: `const _check: FormLoaderArgs['featureFlagClient'] = nestjsFeatureFlagService` must compile, proving the NestJS injectable satisfies the abstract interface that `formLoader` expects. (§8, Constraint 9)
5. **SdfComparators exhaustive test.** Unit test in `sdf-types` that iterates every value in the `Comparators` enum from `@island.is/application/types` and asserts it maps to a defined key in `SdfComparators`. (§8, Constraint 12)

#### Phase 2: SDF Backend Engine (REST + AstAdapter)

Depends on: Phase 1 outputs (screen-compiler, sdf-types, defineWorkflow).

| Step | Action | Output |
|------|--------|--------|
| 2.1 | Create `apps/application-system/api/src/app/modules/sdf/` NestJS module. Implement `sdf.controller.ts` with `GET /sdf/:id/screen?step=&locale=` and `POST /sdf/:id/action`. Swagger-decorate DTOs. The `POST /action` DTO MUST include a `lastKnownPageIndex: number` field for idempotency — the backend rejects writes where this doesn't match the persisted page index (§8, Constraint 18). The `POST /action` handler MUST also define explicit behavior for `VALIDATE`: accept `{ actionType: 'VALIDATE', answers, fieldIds, locale }` and return `{ errors: ValidationError[] }` (NOT a full Screen) — see §8, Constraint 14. | REST endpoints on `application-system-api` |
| 2.2 | Implement `AstAdapterService` inside the SDF module. Follow the pipeline from §5.3 (including Step 3.5: role-based data filtering). Use `screen-compiler` for AST-to-screen conversion. Implement `screen-mapper`, `footer-builder`, `stepper-builder`, `condition-hint` extraction, `i18n-resolver`. The service MUST accept an `ephemeral: boolean` parameter. When `true` (REFETCH actions), the pipeline MUST skip all `TemplateApiActionRunner` execution — no `onEntry` hooks, no X-Road calls, no email sends (§8, Constraint 1). The `condition-hint.ts` module MUST import comparator strings from `SdfComparators` in `@island.is/application/sdf-types`, never hardcode them (§8, Constraint 12). | `AstAdapterService` producing `Screen` payloads |
| 2.3 | Validate AstAdapter against `parental-leave` template. This template uses repeaters, custom fields, multi-role workflows, dynamic conditions, and `adminDataConfig` with pruning rules. Write integration tests that assert `Screen` output for known application states. Tests MUST include: (a) a multi-role assertion — the assignee's Screen for `inReview` must NOT contain applicant-only answer fields (§8, Constraint 4), (b) a REFETCH assertion — calling with `ephemeral: true` must NOT trigger any TemplateApi actions (§8, Constraint 1), (c) an answer-shape invariant assertion — answers persisted via `POST /action NEXT_PAGE` must be byte-compatible with what the legacy SPA would write for the same input (§8, Constraint 13). | Integration test suite for AstAdapter |
| 2.4 | Update OpenAPI spec generation. Run Swagger codegen to produce the spec from the new endpoints. Verify spec includes `SdfApi` operations. | Updated `openapi.yaml` for `application-system-api` |

**Phase 2 Gate — the following MUST pass before merging any Phase 2 PR:**

1. **REFETCH is side-effect-free.** Integration test: trigger a REFETCH on an application in `inReview` state (which has `onEntry: [sendToDirectorateOfLabour]`). Assert zero calls to the `TemplateApiActionRunner`. (§8, Constraint 1)
2. **Role-based data filtering is enforced.** Integration test: generate a Screen for the `assignee` role on `parental-leave` in `inReview`. Assert the Screen payload does NOT contain answer keys that are absent from `roleInState.read` for that role. (§8, Constraint 4)
3. **VALIDATE returns errors, not Screen.** Integration test: `POST /sdf/:id/action { actionType: 'VALIDATE', fieldIds: ['applicantName'], answers: {} }` returns `{ errors: [{ componentId: 'applicantName', message: '...' }] }`, not a `Screen` object. (§8, Constraint 14)
4. **Idempotency works.** Integration test: `POST /sdf/:id/action { actionType: 'NEXT_PAGE', lastKnownPageIndex: 0 }` succeeds. Immediately repeat the same call — it MUST be rejected because the persisted page index has advanced. (§8, Constraint 18)
5. **Answer-shape invariant holds.** Integration test: for `parental-leave` draft, submit identical answers via the legacy `application.controller.ts` `submitApplication` and via `POST /sdf/:id/action NEXT_PAGE`. Assert the resulting `answers` JSON column is identical. (§8, Constraint 13)

#### Phase 3: GraphQL Gateway Layer

Depends on: Phase 2 outputs (REST endpoints with OpenAPI spec).

| Step | Action | Output |
|------|--------|--------|
| 3.1 | Regenerate fetch client in `libs/api/domains/application/src/gen/fetch/` from the updated OpenAPI spec. Verify `SdfApi` class is generated with `getScreen` and `executeAction` methods. | Generated `SdfApi` fetch client |
| 3.2 | Create `sdf.resolver.ts`, `sdf.service.ts`, `sdf.model.ts` in `libs/api/domains/application/src/lib/`. Register `SdfApi` provider in `application.module.ts`. Implement `getScreen` and `executeAction` GQL queries/mutations. | GQL resolvers in shared gateway |
| 3.3 | Test end-to-end: GQL query → REST call → AstAdapter → Screen response. Use the integration tests from 2.3 extended to go through the GQL layer. | End-to-end test coverage |

**Phase 3 Gate — the following MUST pass before merging any Phase 3 PR:**

1. **End-to-end latency baseline.** Measure p50 and p95 latency for `getScreen` (GQL → REST → AstAdapter → response) against `parental-leave` in a dev cluster. Record the baseline. Target: **<300ms p95 for `getScreen`**, **<500ms p95 for `executeAction` (NEXT_PAGE)**. If the baseline exceeds these targets, file a blocking issue before proceeding to Phase 4. (§8, Constraint 17)

#### Phase 4: Next.js Frontend

Depends on: Phase 3 outputs (working GQL endpoint).

| Step | Action | Output |
|------|--------|--------|
| 4.1 | Create `apps/application-system-next` (Next.js App Router). Set up Nx project config (`project.json`), infra chart (reference `apps/application-system/api/infra/application-system-api.ts`), BFF proxy for auth tokens. | Next.js app skeleton with infra |
| 4.2 | Implement `FormRenderer` component that maps the `Screen` GQL payload to Island UI components. Implement `evaluateClientCondition.ts` for instant field toggling — this function MUST import `SdfComparators` from `@island.is/application/sdf-types` and switch on those constants, never hardcoded strings (§8, Constraint 12). Implement `useFormActions` hook for `NEXT_PAGE`, `PREV_PAGE`, `REFETCH`, `SUBMIT`, `VALIDATE`. The hook MUST include `lastKnownPageIndex` in every `POST /action` request for idempotency (§8, Constraint 18). Custom components MUST use the `onAnswerChange(fieldId, value)` callback that routes through `executeAction` — no direct local state mutation that bypasses server validation (§8, Constraint 5). The dynamic component registry MUST validate received `CustomComponent.props` against a Zod schema per component at runtime; log `console.warn` in dev, `Sentry.captureMessage` in prod on mismatch (§8, Constraint 15). | Core rendering pipeline |
| 4.3 | Configure ingress routing: requests for `/umsoknir/<slug>` check `ApplicationConfigurations[slug].useSdf` to decide which frontend receives traffic. Implement as BFF middleware or Nginx/ingress annotation. (§8, Constraint 10) | Routing layer |
| 4.4 | Create a POC template using `defineWorkflow` + `FormBuilder` (e.g., `EXAMPLE_INPUTS`). Set `useSdf: true`. Verify it renders on the Next.js frontend end-to-end. | First SDF-native template running |
| 4.5 | Verify a legacy template (`parental-leave`) renders through the AstAdapter on the Next.js frontend by setting `useSdf: true` in dev. | Legacy template running on new frontend |

**Phase 4 Gate — the following MUST pass before merging any Phase 4 PR:**

1. **ClientCondition uses shared constants.** Code review check: `evaluateClientCondition.ts` must NOT contain any hardcoded comparator strings (`'eq'`, `'neq'`, etc.). All comparisons must reference `SdfComparators` from `@island.is/application/sdf-types`. (§8, Constraint 12)
2. **Custom components cannot bypass server validation.** Manual test: modify a `CustomComponent` to call `setAnswers()` directly (bypassing `onAnswerChange`). Verify the next `NEXT_PAGE` action rejects the stale/unvalidated answers. (§8, Constraint 5)
3. **`useSdf` routing works.** Test: set `useSdf: true` for `EXAMPLE_INPUTS` in `ApplicationConfigurations`. Verify `/umsoknir/example-inputs` routes to the Next.js frontend. Set `useSdf: false` — verify traffic routes to the legacy SPA. (§8, Constraint 10)

#### Phase 5: Incremental Rollout

Depends on: Phase 4 proven stable.

| Step | Action | Output |
|------|--------|--------|
| 5.1 | Migrate templates one at a time. For each: optionally rewrite to `defineWorkflow` + `FormBuilder`, set `useSdf: true` in `ApplicationConfigurations`, and deploy. Legacy templates can also be routed to SDF without rewrite (via AstAdapter). | Per-template migration |
| 5.2 | **Session continuity validation (forward AND rollback).** Both frontends write to the same PostgreSQL `applications` table. For each migrated template, run the cross-frontend integration test: (a) create an application via the legacy SPA, advance to page 3, switch routing to SDF (`useSdf: true`), verify the SDF frontend can load and continue it; (b) create an application via SDF, advance to page 3, set `useSdf: false` (rolling back to legacy SPA), verify the legacy SPA can load and continue it without Zod validation errors. The SDF engine MUST NOT alter the `answers` JSON schema — this is a hard invariant. (§8, Constraint 13) | Cross-frontend compatibility |
| 5.3 | **Tree-shaking audit.** When a template is migrated, verify it no longer pulls `xstate` into the Next.js bundle. Both code paths must be tree-shakeable. | Bundle size validation |
| 5.4 | **Component union review.** If the `Component` GraphQL union has grown past 15 dedicated types, refactor the long tail of simple field types into a `GenericField { id, fieldType: FieldTypeEnum, label, placeholder, required, disabled, config: JSON, clientCondition }` type. Keep dedicated types only for structurally unique fields (Repeater, CustomComponent, FileUpload, TableRepeater). This reduces ongoing maintenance burden. (§8, Constraint 11) | Schema simplification (if triggered) |
| 5.5 | **Latency re-evaluation.** Re-measure p95 latency from the Phase 3 baseline against real production traffic. If REFETCH p95 exceeds 300ms, evaluate whether the GQL gateway SDF resolver should import `screen-compiler` in-process for read-only `getScreen` operations, bypassing the REST hop. (§8, Constraint 17) | Performance optimization (if triggered) |
| 5.6 | When all templates are migrated, decommission the legacy React SPA (`application-system-form`) and remove XState dependencies. | Legacy SPA removed |

---

## 8. Mandatory Implementation Constraints

> **This section is NOT advisory.** Every numbered constraint below is a hard requirement. Each is cross-referenced from the Phase Gate where it must be verified (§7.3). An implementing agent MUST NOT mark a phase step as complete unless the referenced constraints pass. If a constraint cannot be satisfied, the agent MUST stop and escalate — not skip.

### Constraint 1: REFETCH Must Be Side-Effect-Free

- **What:** On `REFETCH`, the `AstAdapterService` MUST thread an `ephemeral: boolean` flag through the entire pipeline. When `true`, the pipeline MUST short-circuit all `TemplateApiActionRunner` execution — no `onEntry` hooks (e.g., `sendToDirectorateOfLabour`), no X-Road calls, no email sends, no database writes. The existing `ApplicationActionService` has no concept of a dry-run; this is net-new plumbing.
- **Why:** Without this guard, a REFETCH that traverses a phase-like code path triggers irreversible side effects (real X-Road calls, duplicate emails).
- **Frontend:** The GraphQL SDF contract supports a `debounce` property on actions (e.g., `onChangeAction: { type: 'REFETCH', debounceMs: 800 }`). Next.js holds keystrokes locally and only fires the network request after the user pauses typing. The `Screen` payload includes a `persisted: boolean` flag on external data entries — the frontend re-triggers REFETCH on resume when unpersisted data is detected.
- **Server-side rate limit:** The NestJS API MUST enforce server-side rate limiting per `(applicationId, providerId)` tuple using a sliding-window counter in Redis (already available in infra). Default: max 10 REFETCH calls per provider per minute per application.
- **Database Protection:** `UPDATE` transactions are strictly reserved for `NEXT_PAGE` and `SUBMIT` actions.
- **Verified at:** Phase 2 Gate #1, Phase 2 Gate #2.

```typescript
page.addTextField('nationalId', 'Kennitala', {
  onChangeAction: {
    type: 'REFETCH',
    debounceMs: 800,
  },
  externalDataProvider: [fetchNameFromRegistry],
})
```

### Constraint 2: Shared Types via Codegen

- **What:** Generate TypeScript interfaces from the NestJS GraphQL schema using `graphql-codegen`, placing them in `libs/application/sdf-types`. Both Next.js and NestJS share the exact same types. The codegen runs as an Nx target in the library's `project.json` as part of the build graph.
- **Why:** Prevents frontend/backend type drift.
- **Verified at:** Phase 1, Step 1.2.

### Constraint 3: Server-Side Rate Limiting for REFETCH

- **What:** The NestJS API MUST enforce server-side rate limiting per `(applicationId, providerId)` tuple using a sliding-window counter in Redis. Default: max 10 REFETCH calls per provider per minute per application.
- **Why:** Frontend debounce alone is insufficient — a malicious or buggy client can bypass it. External API calls go through X-Road integrations where third-party SLAs exist.
- **Verified at:** Phase 2, Step 2.1 (rate limiter must be present on the REFETCH handler).

### Constraint 4: Role-Based Data Filtering Is Mandatory

- **What:** The `AstAdapterService` MUST apply role-based read filters in **Step 3.5** of the pipeline (§5.3). After resolving the role, the pipeline clones the `answers` and `externalData` objects and strips any keys not in `roleInState.read`. All subsequent steps — form compilation, screen mapping, component prop construction — operate on the filtered copies.
- **Why:** Without this, an assignee's `Screen` payload will contain applicant-only data (bank accounts, full nationalId) — a data leak.
- **Verified at:** Phase 2 Gate #2.

### Constraint 5: Custom Components Cannot Bypass Server Validation

- **What:** Custom component writes MUST flow through the `executeAction` server action. The Next.js `FormRenderer` MUST only expose an `onAnswerChange(fieldId, value)` callback that routes through the server action path — no direct local state mutation.
- **Why:** A malicious/modified frontend could inject arbitrary answers that bypass server-side Zod validation.
- **Verified at:** Phase 4 Gate #2.

### Constraint 6: Performance — Measure First, Optimize Later

- **What:** Do NOT build a caching layer during Phases 1-3. Instead: (a) add lightweight timing instrumentation to the `AstAdapterService` pipeline — log wall-clock time for each of the 10 steps in §5.3, (b) establish a latency budget: **<100ms p95 for screen generation excluding external API calls**, (c) measure actual p50/p95/p99 against the `parental-leave` template (the most complex) during the Phase 3 e2e tests. If the budget is exceeded, file a blocking issue with the profiling data and design a caching strategy informed by which pipeline steps are actually slow. If the budget is met, move on — no caching needed.
- **Why:** Designing a cache key scheme (e.g., `(templateId, state, pageIndex, role, featureFlagSet)`) before profiling is premature optimization. Feature-flag-aware cache invalidation is complex and a source of stale-form bugs. The actual bottleneck may turn out to be i18n resolution or external data calls, not AST compilation — profiling will tell you.
- **If caching becomes necessary (Phase 5+):** The cache key MUST include the resolved feature flag set, because `formLoader` can return different `Form` ASTs depending on which flags are active. Consider a two-layer approach: cache the form structure, re-evaluate conditions per request. Use the existing Bull queue with `APPLICATION_SYSTEM_BULL_PREFIX` for any background prefetch jobs.
- **Verified at:** Phase 3 Gate #1 (measurement only — no caching implementation required to pass the gate).

### Constraint 7: Zero React in `screen-compiler`

- **What:** During extraction (Phase 1, Step 1.1), manually audit every import chain from `reducerUtils.ts` through `../types` and `../utils` barrel files. The functions have zero direct React imports (verified), but sibling barrel files in `ui-shell` may re-export React-dependent code. Add a CI step: `rg "from 'react'|from \"react\"" libs/application/screen-compiler/` MUST return zero results. Do NOT rely solely on `nx dep-graph` — it can miss type-only re-exports.
- **Why:** If `screen-compiler` gains a transitive React dependency, it will break when imported by the NestJS backend.
- **Verified at:** Phase 1 Gate #1.

### Constraint 8: `defineWorkflow` Golden-File Parity Test

- **What:** Write a golden-file integration test: take the actual `parental-leave` XState `stateMachineConfig`, write its `defineWorkflow` equivalent, and assert both produce structurally identical `ApplicationStateMeta` for every state. This test runs in CI and blocks merge on divergence.
- **Why:** The admin portal, Mínar síður, and lifecycle worker all read `ApplicationStateMeta` from the compiled config. If `defineWorkflow` output diverges, they silently break.
- **Verified at:** Phase 1 Gate #3.

### Constraint 9: `formLoader` FeatureFlagClient Type Compatibility

- **What:** Verify that `FormLoaderArgs` in `libs/application/types` uses an abstract interface (not a concrete class) for `featureFlagClient`. Add a compile-time assertion test: `const _check: FormLoaderArgs['featureFlagClient'] = nestjsFeatureFlagService` must compile.
- **Why:** `formLoader` runs in the browser (singleton HTTP client) and on the server (NestJS injectable). If the types diverge, the first flag-gated form will fail at runtime.
- **Verified at:** Phase 1 Gate #4.

### Constraint 10: SDF Routing via `useSdf` Template Flag

- **What:** The `useSdf: boolean` field on `ApplicationConfigurations` is the sole routing switch for Phases 1-5. When `true`, the ingress/BFF layer routes traffic for that template to `application-system-next`. When `false` or absent, traffic goes to the legacy SPA. Templates are migrated one at a time by setting `useSdf: true` and deploying.
- **Why:** This is the simplest mechanism and aligns with the existing `ApplicationConfigurations` pattern (`readyForProduction` checks already read this object). A deploy-based toggle is sufficient during controlled, incremental rollout.
- **If instant rollback becomes necessary (Phase 5+):** Consider adding a ConfigCat runtime flag per template (e.g., `applicationSystem.sdf.<slug>`) that takes precedence over the build-time `useSdf` field. This would allow toggling without a deploy. Do not build this until there is a demonstrated need.
- **Verified at:** Phase 4, Step 4.3.

### Constraint 11: Component Union Size Management

- **What:** If the `Component` GraphQL union grows past 15 dedicated types, refactor the long tail of simple field types into a `GenericField { id, fieldType: FieldTypeEnum, label, placeholder, required, disabled, config: JSON, clientCondition }` type. Keep dedicated types only for structurally unique fields (Repeater, CustomComponent, FileUpload, TableRepeater).
- **Why:** Every new field type requires changes in three files (schema, screen-mapper, FormRenderer). At 30+ members this becomes a maintenance burden.
- **Verified at:** Phase 5, Step 5.4.

### Constraint 12: Comparator Strings — Single Source of Truth

- **What:** Define a `SdfComparators` constant map in `libs/application/sdf-types` (e.g., `EQUALS → 'eq'`, `NOT_EQUAL → 'neq'`). The backend `condition-hint.ts` and the frontend `evaluateClientCondition.ts` MUST both import from this map — no hardcoded strings. Add a unit test that exhaustively asserts every `Comparators` enum value maps to a defined key in `SdfComparators`.
- **Why:** If the backend emits `'EQUALS'` but the frontend switches on `'eq'`, the `switch` falls through to `default: return true`, silently showing fields that should be hidden.
- **Verified at:** Phase 1 Gate #5, Phase 4 Gate #1.

### Constraint 13: Answer-Shape Invariant (Forward and Rollback Compatibility)

- **What:** The SDF engine MUST NOT alter the `answers` JSON schema. Any `POST /sdf/:id/action` that writes to the `answers` column must produce output byte-compatible with what the legacy SPA would write for the same input. Add a cross-frontend integration test: create an application via SDF, write answers, switch routing to legacy, verify the SPA loads and continues the application without Zod validation errors.
- **Why:** During migration, both frontends write to the same PostgreSQL table. If the SDF engine persists answers in a subtly different shape (different date formats, enum casing, nested key structure), the legacy SPA's Zod validation or XState guards will reject the application on rollback.
- **Verified at:** Phase 2 Gate #5, Phase 5, Step 5.2.

### Constraint 14: `VALIDATE` Action Returns Errors, Not Screen

- **What:** `POST /sdf/:id/action { actionType: 'VALIDATE', answers, fieldIds, locale }` MUST return `{ errors: ValidationError[] }`, NOT a full `Screen`. The `fieldIds` parameter scopes validation to specific fields using `getFormNodeFieldIds` logic.
- **Why:** Returning a full Screen for every `onBlur` event is too expensive. VALIDATE is a lightweight operation.
- **Verified at:** Phase 2 Gate #3.

### Constraint 15: `CustomComponent` Props Runtime Validation

- **What:** The frontend's dynamic component registry MUST validate received `CustomComponent.props` against a Zod schema per component at runtime. Log `console.warn` in dev, `Sentry.captureMessage` in prod on mismatch. For Phase 5+, consider adding a `CustomComponentRegistry` type map in `sdf-types` for codegen-level checking.
- **Why:** `CustomComponent { componentName: string, props: string }` is completely untyped at the GraphQL layer. Typos in props surface only at runtime.
- **Verified at:** Phase 4, Step 4.2.

### Constraint 16: Nx Boundary Enforcement for `screen-compiler`

- **What:** Verify `.eslintrc.json` has an `@nx/enforce-module-boundaries` constraint that prevents `type:util` from importing `type:ui` or `type:feature`. If not, add it before beginning Phase 1. Run `nx lint screen-compiler` — must report zero boundary violations.
- **Why:** Without this, `screen-compiler` could accidentally re-import from `ui-shell` (its origin), creating a circular dependency.
- **Verified at:** Phase 1 Gate #2.

### Constraint 17: End-to-End Latency Budget

- **What:** Measure end-to-end latency (browser → GQL gateway → REST → AstAdapter → response). Target: **<300ms p95 for `getScreen` / `REFETCH`**, **<500ms p95 for `NEXT_PAGE`** (including external API calls). If the GQL gateway hop proves to be a bottleneck in Phase 5, evaluate whether the gateway SDF resolver can import `screen-compiler` in-process for read-only operations.
- **Why:** Two network hops (Next.js → GQL → REST) plus serialization at each layer adds latency beyond the AstAdapter's own computation time.
- **Verified at:** Phase 3 Gate #1, Phase 5, Step 5.5.

### Constraint 18: Idempotent Action Endpoint

- **What:** `POST /sdf/:id/action` MUST include a `lastKnownPageIndex` field in the request. The backend rejects writes where this doesn't match the currently persisted page index, forcing the frontend to re-fetch the current `Screen` before retrying. Wrap the validate-persist-advance sequence in a database transaction — no partial state.
- **Why:** If validation passes but the DB write fails (transient Postgres error), a retry without idempotency protection could cause duplicate answer writes or frontend/backend state desync.
- **Verified at:** Phase 2 Gate #4.

---

## 9. AI-Driven Application Generation (LLM Skills)

The most powerful advantage of decoupling our UI from React code via SDF is that it makes the `island.is` application system inherently AI-Ready.

### The Vision: "Prompt-to-PR"

A developer describes a new application to an LLM assistant (e.g., via a Cursor skill, CLI tool, or internal chat). The LLM generates the template files — Zod schema, `defineWorkflow`, `FormBuilder` forms — and the developer reviews, adjusts, and submits a normal PR. The generated code goes through CI, type-checking, and code review like any hand-written template.

1. **The Prompt:** A developer prompts: _"Create an application for a Dog License. I need the owner's name, kennitala, the dog's breed (dropdown), and an upload field for vaccination records. Add a review step for the municipal office."_
2. **The LLM Skill Execution:** The LLM is provided with the `FormBuilder` API, `defineWorkflow` API, and the `Component` type definitions as context (via a skill file or system prompt).
3. **The Code Generation:** The LLM generates the template files: `dataSchema.ts` (Zod), `template.ts` (`defineWorkflow`), `forms/DraftForm.ts` (`FormBuilder`), and the `templateLoaders` / `ApplicationConfigurations` registration entries.
4. **Developer Review:** The developer reviews the generated code, makes adjustments, and opens a PR. Standard CI validates types, lint, and tests.

### Example LLM Skill Definition

```typescript
const generateApplicationSkill = {
  name: 'generate_application_ast',
  description: 'Generates a Server-Driven Form AST based on user requirements.',
  parameters: {
    type: 'object',
    properties: {
      dataSchema: {
        type: 'string',
        description: 'The Zod schema definition',
      },
      workflow: {
        type: 'object',
        description:
          'The directed graph of phases (e.g., draft -> inReview -> done)',
      },
      formAst: {
        type: 'object',
        description:
          'The structured UI array of Sections, Pages, and Components',
      },
    },
    required: ['dataSchema', 'workflow', 'formAst'],
  },
}
```

### Safety Boundaries

- **Developer-in-the-loop:** LLM output is always reviewed by a developer before it enters the codebase. There is no runtime code generation or dynamic `eval()`.
- **Standard CI applies:** Generated code is type-checked, linted, and tested by the same Nx pipeline as hand-written templates. If the LLM generates invalid TypeScript, broken Zod schemas, or incorrect `defineWorkflow` configs, CI catches it.
- **Skill design guidance:** The LLM skill/prompt should constrain output to the `FormBuilder` API, `defineWorkflow` API, and standard field types. This naturally steers the LLM toward correct output — but the enforcement mechanism is the PR review and CI, not a runtime validator.

### Business Value

- **Drastically Reduced Time-to-Market:** Simple applications can be prototyped and deployed in hours instead of sprints.
- **Standardization:** The AI is constrained by the strict Server-Driven GraphQL contract, ensuring it can only output components that match `@island.is/island-ui/core`.
- **Future-Proofing:** As LLMs become more capable, the architecture is positioned for AI-augmented public service delivery.

---

## 10. Monorepo Library Map (Implementation Reference)

This section provides the exact file paths an implementing agent needs to find the existing code referenced throughout this document. All paths are relative to the monorepo root.

### Existing Libraries (Read/Understand)

| Area                               | Path                                                                                | What It Contains                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Application types & config**     | `libs/application/types/src/lib/ApplicationTypes.ts`                                | `ApplicationTypes` enum (type IDs), `ApplicationConfigurations` (slug, translation, **`useSdf`**). **MODIFY: add `useSdf` field to config type and per-template entries.**                                                                                                                                                                       |
| **Application types**              | `libs/application/types/src/lib/`                                                   | `ApplicationTemplate.ts`, `Form.ts` (FormItemTypes, FormLoader, Schema), `Fields.ts` (FieldTypes, all field interfaces), `Condition.ts` (StaticCheck, DynamicCheck, MultiConditionCheck), `StateMachine.ts` (RoleInState, CallToAction, ApplicationStateMeta, createApplicationMachine), `Application.ts` (Application, ExternalData, FormValue) |
| **Form/Field builders**            | `libs/application/core/src/lib/formBuilders.ts`                                     | `buildForm`, `buildSection`, `buildSubSection`, `buildMultiField`, `buildRepeater`, `buildExternalDataProvider`                                                                                                                                                                                                                                  |
| **Field builders**                 | `libs/application/core/src/lib/fieldBuilders.ts`                                    | `buildTextField`, `buildCheckboxField`, `buildCustomField`, `buildSubmitField`, and 30+ other field builders. **Each builder's field type must have a corresponding GraphQL Component type.**                                                                                                                                                    |
| **Condition evaluation**           | `libs/application/core/src/lib/conditionUtils.ts`                                   | `shouldShowFormItem` — evaluates StaticCheck, DynamicCheck, and MultiConditionCheck conditions. **Extract into screen-compiler.**                                                                                                                                                                                                                |
| **Validation**                     | `libs/application/core/src/validation/validators.ts`                                | `validateAnswers` — Zod validation scoped to `currentScreenFields`.                                                                                                                                                                                                                                                                              |
| **Template helper**                | `libs/application/core/src/lib/ApplicationTemplateHelper.ts`                        | `changeState`, `getApplicationStateInformation`, `getApisFromRoleInState` — state machine operations.                                                                                                                                                                                                                                            |
| **UI shell (rendering pipeline)**  | `libs/application/ui-shell/src/reducer/reducerUtils.ts`                             | `convertFormToScreens`, `getNavigableSectionsInForm`, `moveToScreen`, `findCurrentScreen`, `canGoBack`, `convertRepeaterToScreens`, `convertMultiFieldToScreen`. **These are the functions to extract into screen-compiler.**                                                                                                                    |
| **UI shell (validation resolver)** | `libs/application/ui-shell/src/validation/resolver.ts`                              | `getFormNodeFieldIds` — collects field IDs from current screen for scoped validation. **Extract into screen-compiler.**                                                                                                                                                                                                                          |
| **UI shell (form rendering)**      | `libs/application/ui-shell/src/components/Screen.tsx`                               | Switches on `screen.type` to render `FormRepeater`, `FormMultiField`, `FormExternalDataProvider`, or `FormField`. **Study as specification for screen-mapper.**                                                                                                                                                                                  |
| **Template loader**                | `libs/application/template-loader/src/lib/templateLoaders.ts`                       | Dynamic import map: `ApplicationTypes -> () => import('...')`. **MODIFY: add entry for each new template.**                                                                                                                                                                                                                                      |
| **Template loader API**            | `libs/application/template-loader/src/index.ts`                                     | `getApplicationTemplateByTypeId`, `getApplicationUIFields` — used by both SPA and SDF engine.                                                                                                                                                                                                                                                    |
| **Template API modules**           | `libs/application/template-api-modules/src/lib/modules/`                            | `TemplateAPIModule`, `BaseTemplateApiService`, `TemplateApiActionRunner` — backend action execution per template.                                                                                                                                                                                                                                |
| **GQL domain (application)**       | `libs/api/domains/application/src/lib/`                                             | `application.resolver.ts`, `applicationV2.resolver.ts`, `application.service.ts`, `application.module.ts`. **MODIFY: add SDF resolver, service, model, and SdfApi provider.**                                                                                                                                                                    |
| **GQL domain (generated client)**  | `libs/api/domains/application/src/gen/fetch/`                                       | Auto-generated `ApplicationsApi`, `PaymentsApi` from `application-system-api` OpenAPI spec. **Regenerate to include new SDF endpoints.**                                                                                                                                                                                                         |
| **REST controllers**               | `apps/application-system/api/src/app/modules/application/application.controller.ts` | Existing REST endpoints. **Study as pattern reference for `sdf.controller.ts`.**                                                                                                                                                                                                                                                                 |
| **Infra config**                   | `apps/application-system/api/infra/application-system-api.ts`                       | Service setup, Redis, X-Road integrations, Bull queue config, replica/resource limits.                                                                                                                                                                                                                                                           |
| **Example templates**              | `libs/application/templates/examples/`                                              | Simple templates for initial testing.                                                                                                                                                                                                                                                                                                            |
| **Complex template**               | `libs/application/templates/parental-leave/`                                        | Uses repeaters, custom fields, multi-role workflows, dynamic conditions. **Use for AstAdapter validation.**                                                                                                                                                                                                                                      |

### Template Registration Touchpoints (for implementing agents)

When creating a new SDF template or migrating an existing one, these four files must be modified:

| Step | File                                                          | Action                                                                              |
| ---- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1    | `libs/application/types/src/lib/ApplicationTypes.ts` (enum)   | Add `APPLICATION_NAME = 'ApplicationName'` to `ApplicationTypes`                    |
| 2    | `libs/application/types/src/lib/ApplicationTypes.ts` (config) | Add entry to `ApplicationConfigurations` with `slug`, `translation`, `useSdf: true` |
| 3    | `libs/application/template-loader/src/lib/templateLoaders.ts` | Add `[ApplicationTypes.APPLICATION_NAME]: () => import(...)`                        |
| 4    | `libs/application/templates/<name>/`                          | Create template library with `index.ts`, `dataSchema.ts`, `template.ts`, `forms/`   |

### New Libraries to Create

| Library           | Path                                | Nx Tags                           | Can Import From                                                                                                             |
| ----------------- | ----------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `screen-compiler` | `libs/application/screen-compiler/` | `scope:application`, `type:util`  | `@island.is/application/types`, `@island.is/application/core` (condition utils, form utils only), `@island.is/shared/types` |
| `sdf-types`       | `libs/application/sdf-types/`       | `scope:application`, `type:types` | Nothing (generated types only)                                                                                              |

### Existing Libraries to Modify

| Library                         | Path                                                 | Changes                                                                                       |
| ------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `api/domains/application`       | `libs/api/domains/application/src/lib/`              | Add `sdf.resolver.ts`, `sdf.service.ts`, `sdf.model.ts`. Register in `application.module.ts`. |
| `api/domains/application (gen)` | `libs/api/domains/application/src/gen/fetch/`        | Regenerate from updated OpenAPI spec to include `SdfApi`.                                     |
| `application/types`             | `libs/application/types/src/lib/ApplicationTypes.ts` | Add `useSdf?: boolean` to `ApplicationConfigurations` type.                                   |

### New App to Create

| App                       | Path                            | Depends On                                                                          |
| ------------------------- | ------------------------------- | ----------------------------------------------------------------------------------- |
| `application-system-next` | `apps/application-system-next/` | `@island.is/island-ui/core`, `@island.is/application/sdf-types`, auth/BFF libraries |

### New Modules in Existing Apps

| Module                | Path                                               | Type                       | Depends On                                                                                                         |
| --------------------- | -------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `SDFModule` (REST)    | `apps/application-system/api/src/app/modules/sdf/` | NestJS Module + Controller | `screen-compiler`, `ApplicationModule` (existing), `TemplateAPIModule` (existing), `FeatureFlagService` (existing) |
| `SDF resolvers` (GQL) | `libs/api/domains/application/src/lib/sdf.*`       | GraphQL Resolver + Service | `SdfApi` (generated fetch client), `sdf-types`                                                                     |

---

## 11. Conclusion & Next Steps

By migrating to Server-Driven Forms, we decouple UI rendering from complex state and schema logic. This provides immediate performance gains, secures the validation layer entirely on the backend, and via the new Workflow/Fluent API, drastically reduces the cognitive load for engineers building applications.

The AstAdapter strategy — extracting and reusing the existing `convertFormToScreens` pipeline rather than reimplementing it — ensures behavioral parity with the legacy system and reduces migration risk.

**Action Items (ordered, no time estimates — see §7.3 for full breakdown, §8 for mandatory constraints):**

1. **Phase 1 — Foundation:** Create `screen-compiler` library (extract from `ui-shell`), create `sdf-types` library (GraphQL codegen + `SdfComparators`), implement `defineWorkflow` builder in `application/core`, implement `FormBuilder` fluent API, add `useSdf` field to `ApplicationConfigurations` type. **Gate: 5 mandatory checks (§7.3) — zero React, Nx boundaries, golden-file test, FeatureFlagClient type assertion, comparator exhaustiveness.**
2. **Phase 2 — SDF Backend:** Add REST endpoints to `application-system-api`, implement `AstAdapterService` pipeline (with ephemeral flag, role-based data filtering, VALIDATE contract, idempotent actions), validate against `parental-leave` template, generate OpenAPI spec. **Gate: 5 mandatory checks — REFETCH side-effect-free, data filtering, VALIDATE response, idempotency, answer-shape invariant.**
3. **Phase 3 — GraphQL Gateway:** Regenerate fetch client, create SDF resolvers in `libs/api/domains/application/`, test end-to-end through GQL layer. **Gate: latency baseline measurement.**
4. **Phase 4 — Next.js Frontend:** Create `application-system-next` app with infra, implement `FormRenderer` and `evaluateClientCondition` (shared comparator constants), configure ingress routing via `useSdf` template flag, POC with one new and one legacy template. **Gate: 3 mandatory checks — shared constants, custom component security, `useSdf` routing.**
5. **Phase 5 — Rollout:** Per-template migration via `useSdf` flag, bidirectional session continuity validation, tree-shaking audit, component union review, latency re-evaluation, eventual decommission of legacy SPA.
6. **Phase 6 — AI Generation:** LLM skill for "prompt-to-PR" template generation (§9). Developer-in-the-loop — generated code goes through normal PR review and CI.
