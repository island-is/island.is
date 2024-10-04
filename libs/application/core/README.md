# Application Core

## About

Provides types and utilities for building applications, forms, and schemas foundational to the application system.

## Application

Contains:

- `applicant` info
- `typeId`
- `answers`
- `externalData`
- `state`
- Additional details

## Data Providers

Store immutable external data from sources like x-road for pre-filling or validation.

## Application Template

`ApplicationTemplate` interface underpins the system. Templates extend this interface, featuring:

- Unique `type`
- `dataSchema` for validation
- `answerValidators` for server-side checks
- `stateMachineConfig` for flow and role interactions

### Translations

Define "translatable" messages. Load and cache for 15 minutes.

#### Configuration

Add translation namespaces:

```diff
const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.EXAMPLE,
  name: m.name,
+ translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
```

#### States

States have `title` and `description`:

```diff
[States.draft]: {
  meta: {
    name: 'Umsókn um ökunám',
+   title: m.draftTitle,
+   description: m.draftDescription,
    progress: 0.25,
    lifecycle: DefaultStateLifeCycle,
    roles: [
```

### Header Information

Set `institution` for headers:

```diff
const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.EXAMPLE,
  name: m.name,
+ institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
```

### Feature Flags

To use:

1. Request ConfigCat access.
2. Create a flag (“On” in Dev, “Off” in Prod/Staging).
3. Label it “applicationSystemFlag”.
4. Ensure `CONFIGCAT_SDK_KEY` in `.env.secret`.
5. Add to `@island.is/feature-flags`.
6. Include in template.

```diff
const ReferenceApplicationTemplate: ApplicationTemplate<
 ApplicationContext,
 ApplicationStateSchema<ReferenceTemplateEvent>,
 ReferenceTemplateEvent
> = {
 type: ApplicationTypes.EXAMPLE,
 name: m.name,
 institution: m.institutionName,
+ featureFlag: Feature.exampleApplication,
 translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
 dataSchema: ExampleSchema,
```

#### DataSchema

Use Zod for validation:

```typescript
.refine((n) => n && !kennitala.isValid(n), {
  params: m.dataSchemeNationalId,
}),
```

#### AnswerValidators

Use for custom server-side validation.

### Application Type

Add enum values to `ApplicationTypes` for new templates.

### Data Schema

Use `dataSchema` for validation with [Zod](https://github.com/vriad/zod).

### State Machine

Use `application-core` types, leveraging [xstate](https://xstate.js.org/docs/).

### States

Define as needed, representing system time points.

#### Status

Statuses include:

- `notstarted`
- `draft`
- `inprogress`
- `completed`
- `rejected`
- `approved`

```typescript
export enum ApplicationStatus {
  NOT_STARTED = 'notstarted',
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  DRAFT = 'draft',
}
```

#### Life Cycle

Define listing visibility and database pruning:

```typescript
type StateLifeCycle =
  | {
      shouldBeListed: boolean
      shouldBePruned: false
      shouldDeleteChargeIfPaymentFulfilled?: boolean | null
    }
  | {
      shouldBeListed: boolean
      shouldBePruned: true
      whenToPrune: number | ((application: Application) => Date)
      shouldDeleteChargeIfPaymentFulfilled?: boolean | null
    }
```

### Roles

Define `read`/`write` permissions; roles specify `formLoader` for state-based rendering.

### Pending Action

Specify `pendingAction` for state, customizable by role and application answers.

### Application History

Log event-triggered history for each state.

### Delete Application

Set `delete: true` for role in a state to enable deletions.

## Form

Describes flow via JSON for `application-ui-shell`.

### Fields

Questions/information with predefined/custom components; validate with `dataSchema`.

### Creating a New Field Component

1. Add name to `FieldTypes`/`FieldComponents`.
2. Extend `BaseField`.
3. Add to `Field` type.
4. Create builder in `fieldBuilders.ts`.
5. Create React component.
6. Export in `index.ts`.
7. Implement in forms.

### Conditions

Show/hide fields based on logic.

### Sections and SubSections

Organize form flow into chapters for navigation.

### Multi-fields and External Data Providers

Group fields, integrate data with `DataProviders`.

### Custom Errors for Data Providers

Display errors with provider-specific messages.

### Dynamic Application Names

Use `name` function for dynamic naming.

### Draft Status Bar

Customize progress with `draftPageNumber`.

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda-applications/members)
