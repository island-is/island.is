# Application Core

## About

This library provides types and utilities for building applications, forms, and schemas, serving as the foundation for the entire application system.

## Application

Defines a stored application instance, containing:

- `applicant` information
- `typeId` of the application
- `answers` to application questions
- `externalData` attached
- `state` of the application
- Additional details

## Data Providers

Applications often require storing immutable external data, fetched from sources like x-road. This data aids in pre-filling fields or for validation purposes.

## Application Template

The `ApplicationTemplate` interface underpins the system. Each self-service application relies on a template extending this interface, featuring:

- Unique `type`
- `dataSchema` for quick validation
- `answerValidators` for custom server-side checks
- `stateMachineConfig` for defining the application flow and user role interactions

### Translations

Define "translatable" messages using the `translationNamespaces` field, supporting multiple namespaces from Contentful. Initial loading fetches and caches data for 15 minutes.

#### Configuration

Add translation namespaces to your template:

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

States can have their own `title` and `description`, enhancing user understanding within service portals.

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

Show institution and application name in headers by setting the `institution` field in the template, accepting strings or "translatable" objects.

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

To use a feature flag:

1. Request ConfigCat access.
2. Create a feature flag (default "On" in Dev, "Off" in Production/Staging).
3. Add "applicationSystemFlag" label to the flag.
4. Ensure `CONFIGCAT_SDK_KEY` is in `.env.secret`.
5. Add your flag to the `@island.is/feature-flags`.
6. Include the feature flag in the application template.

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

Use Zod for schema validation. Pass custom error messages using the `params` field.

```typescript
.refine((n) => n && !kennitala.isValid(n), {
  params: m.dataSchemeNationalId,
}),
```

#### AnswerValidators

Provide custom validation when Zod schema is insufficient. Validators execute on the server during answer updates.

### Application Type

Each application template has a unique type. Add enum values to the `ApplicationTypes` when creating new templates.

### Data Schema

Maintain consistent validation with `dataSchema` using [Zod](https://github.com/vriad/zod). Define the schema for each question requiring validation and error messages.

### State Machine

Utilize `application-core` types and interfaces for state machines, built upon [xstate](https://xstate.js.org/docs/).

### States

Define application states as needed, representing system points in time. More complex examples can be referenced from different templates.

#### Status

Application statuses include:

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

Define state life cycles, affecting listing visibility and database pruning.

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

Roles define `read` and `write` permissions. Each role specifies a `formLoader` for appropriate form rendering based on the application state. Actions are tied to state machine events allowing state transitions.

### Pending Action

Specify a "pendingAction" for each state, appearing in the application history with a user prompt. Customize content based on role and application answers.

### Application History

Display event-triggered history logs for each state. Logs are stored and can be updated post-definition.

### Delete Application

Enable users to delete applications by setting `delete: true` for a role in a state.

## Form

Describes form flow with a structured JSON object used by `application-ui-shell`.

### Fields

Fields can be questions or informative. They include predefined components (e.g., TextField, CheckboxField) or custom implementations. Validation through `dataSchema` relies on field `id`.

### Creating a New Field Component

1. Add the field name to `FieldTypes` and `FieldComponents` in `fields.ts`.
2. Create an interface extending `BaseField` with custom props.
3. Add the field to the `Field` type.
4. Create a function in `fieldBuilders.ts` to build the new field.
5. Create a React component for the field.
6. Export the new component in `index.ts`.
7. Implement the new field in forms.

### Conditions

Apply conditions to fields for showing/hiding based on user input or predefined logic.

### Sections and SubSections

Organize form flow cosmetically into chapters, improving user navigation experience.

### Multi-fields and External Data Providers

Group and manage fields, or integrate immutable external data via `DataProviders`.

### Custom Errors for Data Providers

Display errors for data provider failures with custom messages using provider implementations.

### Dynamic Application Names

Supply a function for the `name` variable to dynamically generate application names based on user input.

### Draft Status Bar

Customize draft progress using `draftPageNumber` to reflect application specifics in the status bar.

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda-applications/members)