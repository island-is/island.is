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

States have `title` and `description`, which are displayed on the application card:

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

Use [Zod](https://github.com/vriad/zod) for validation:

```typescript
const schema = z.object({
  name: z.string().min(1),
  age: z.number().min(18),
})
```

For custom error messages, pass a translation object to params:

```typescript
.refine((n) => n && !kennitala.isValid(n), {
  params: m.dataSchemeNationalId,
}),
```

#### AnswerValidators

Use for custom server-side validation.

### Application Type

Add enum values to [`ApplicationTypes`](https://github.com/island-is/island.is/blob/main/libs/application/types/src/lib/ApplicationTypes.ts) for new templates.

### Data Schema

Use `dataSchema` for validation with [Zod](https://github.com/vriad/zod).

### State Machine

Use `application-core` types, leveraging [xstate](https://xstate.js.org/docs/).

### States

See [xstate](https://xstate.js.org/docs/guides/states.html) for detailed documentation.

> A state is an abstract representation of a system (such as an application) at a specific point in time. As an application is interacted with, events cause it to change state. A finite state machine can be in only one of a finite number of states at any given time.

Each state describes what `roles` can access it, and what each role can do in said state.

[Example](https://github.com/island-is/island.is/blob/2bd7d23d979dba86963254c14bdc066bd8e0ae63/libs/application/templates/reference-template/src/lib/ReferenceApplicationTemplate.ts#L88) from `reference-template`.

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

By default states will not be pruned and will always be listed.

### Roles

Define `read`/`write` permissions; roles specify `formLoader` for state-based rendering of forms.

Example of different roles with different form loaders:

```typescript
stateMachineConfig: {
  states: {
    ...
    inReview: {
      meta: {
        name: 'In Review',
        roles: [
          {
            id: 'reviewer',
            formLoader: () =>
              import('../forms/ReviewApplication').then((val) =>
                Promise.resolve(val.ReviewApplication),
              ),
            actions: [
              { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
              { event: 'REJECT', name: 'Hafna', type: 'reject' },
            ],
            read: 'all',
            write: {
              answers: ['reviewerComment'],
            },
          },
          {
            id: 'applicant',
            formLoader: () =>
              import('../forms/PendingReview').then((val) =>
                Promise.resolve(val.PendingReview),
              ),
            read: 'all',
          },
        ],
      },
      on: {
        APPROVE: { target: 'approved' },
        REJECT: { target: 'rejected' },
      },
    },
    ...
  },
},
```

### Pending Action

Specify `pendingAction` for state, customizable by role and application answers.

```typescript
[States.waitingToAssign]: {
  meta: {
    name: 'Waiting to assign',
    ...
    actionCard: {
      pendingAction: {
        title: 'Waiting for reviewer',
        content:
          'The application is now waiting for a reviewer to be assigned.',
        displayStatus: 'warning',
      },
      ...
    },
```

You can pass a function that uses the application answers and the user's role to determine the color, content, and title of the box to display to the user.

```typescript
  ...
    actionCard: {
      pendingAction: (answers, role) => {
        let title, content, displayStatus
        if (role === 'applicant') {
          title = 'Waiting for Reviewer'
          content =
            'Your application is waiting for a reviewer to be assigned.'
          displayStatus = 'info'
        } else if (role === 'reviewer') {
          title = 'Applications to Review'
          content = 'You have applications waiting to be reviewed.'
          displayStatus = 'warning'
        }
        return { title, content, displayStatus }
      },
  ...
```

### Application History

Log event-triggered history for each state.

Example:

```typescript
[States.inReview]: {
  meta: {
    name: 'In review',
    ...
    actionCard: {
      ...
      historyLogs: [
        {
          onEvent: DefaultEvents.SUBMIT,
          logMessage: application.applicationSubmitted,
        }
      ],
      ...
    },
```

### Delete Application

Set `delete: true` for role in a state to enable deletions.

## Form

The form describes UI flow via JSON which feeds into `application-ui-shell`.

### Fields

Questions/information with predefined/custom components; validate with `dataSchema`.

### Creating a New Field Component

1. Add name to [`FieldTypes` and `FieldComponents`](https://github.com/island-is/island.is/blob/main/libs/application/types/src/lib/Fields.ts).
2. Extend `BaseField`.
3. Add to `Field` type.
4. Create builder in [`fieldBuilders.ts`](https://github.com/island-is/island.is/blob/main/libs/application/core/src/lib/fieldBuilders.ts).
5. Create React component in [`ui-fields` library](https://github.com/island-is/island.is/tree/main/libs/application/ui-fields/src/lib).
6. Export in `index.ts`.
7. Implement in forms.

```typescript
// application/types/src/lib/Fields.ts
export interface NewField extends BaseField {
  readonly type: FieldTypes.NEW_FIELD
  component: FieldComponents.NEW_FIELD
  myProp: string
  myOtherProp: number
}
```

```typescript
// application/core/src/lib/fieldBuilders.ts
export const buildNewField = (
  data: Omit<NewField, 'type' | 'component' | 'children'>,
): NewField => {
  const { myProp, myOtherProp } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    myProp,
    myOtherProp,
    type: FieldTypes.NEW_FIELD,
    component: FieldComponents.NEW_FIELD,
  }
}
```

```typescript
// ui-fields/src/lib/NewFormField.tsx
interface Props extends FieldBaseProps {
  field: NewField
}

export const NewFormField: FC<Props> = ({ application, field }) => {
  return <Box>Your new component.</Box>
}
```

### Conditions

Show/hide fields based on dynamic or static logic.

### Sections and SubSections

Organize form flow into chapters for navigation.

### Multi-fields and External Data Providers

Group fields, integrate data with `DataProviders`.

### Custom Errors for Data Providers

Display errors with provider-specific messages.

### Dynamic Application Names

Use `name` function on template for dynamic naming based on application context.

### Draft Status Bar

Customize progress with `draftPageNumber`.

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda-applications/members)
