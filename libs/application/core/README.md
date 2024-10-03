```markdown
# Application Core

This documentation provides an overview of the types and utilities contained in the Application Core library, essential for constructing applications, forms, and schemas within the application system's framework.

## Application

The `application` type defines a representation of a stored application instance. It comprises several components:

- `applicant`: The individual applying.
- `typeId`: The identifier indicating what the application pertains to.
- `answers`: The responses to the application questions.
- `externalData`: The supplementary data linked to the application.
- `state`: The current status of the application.
- Additional attributes as needed.

## Data Providers

Applications often utilize external data that remains uneditable but must be stored within the application. This data, often sourced from services like x-road or others on island.is, is used for pre-filling form fields or serving validation purposes.

## Application Template

The `ApplicationTemplate` interface is central to the system, with each self-service application flow relying on a template extending this interface. Key components of an application template include:

- Unique `type`.
- `dataSchema` for data validation.
- `answerValidators` for custom server-side validation.
- `stateMachineConfig` governing the application's flow and interaction options based on user roles.

### Translations

For defining translatable API-side messages, use the `translationNamespaces` field in the template. This accepts an array of namespaces, pulled and cached from Contentful for 15 minutes.

#### Configuration

Enhance your template object with:

```typescript
const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
 > = {
  type: ApplicationTypes.EXAMPLE,
  name: m.name,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
```

Example: [ReferenceApplicationTemplate](https://github.com/island-is/island.is/blob/main/libs/application/templates/reference-template/src/lib/ReferenceApplicationTemplate.ts#L84).

#### States

Define `title` and `description` fields for each state in your state machine. These fields enhance user comprehension by providing insight into the process step in the application list on the service portal.

```typescript
[States.draft]: {
  meta: {
    name: 'Umsókn um ökunám',
    title: m.draftTitle,
    description: m.draftDescription,
    progress: 0.25,
    lifecycle: DefaultStateLifeCycle,
    roles: [
```

Currently, only the `description` field is utilized on the application list. The `title` field is anticipated for future application page designs.

### Header Information

To display header information regarding the handling institution and application name, use the `institution` field in the template. It accepts a string or a translatable object.

```typescript
const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
 > = {
  type: ApplicationTypes.EXAMPLE,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
```

The application name is sourced from the `name` field in the same object.

### Feature Flags

For gating applications behind feature flags:

1. Request ConfigCat access from DevOps.
2. Add your flag to ConfigCat (<https://app.configcat.com/>) with "applicationSystemFlag" label.
3. Ensure `CONFIGCAT_SDK_KEY` is in .env.secret, retrieving it via commands like `yarn get-secrets application-system-form`.
4. Introduce your flag in @island.is/feature-flags inside libs/feature-flags/src/lib/features.ts.
5. Link the featureFlag in the application template within "featureFlag".

```typescript
const ReferenceApplicationTemplate: ApplicationTemplate<
 ApplicationContext,
 ApplicationStateSchema<ReferenceTemplateEvent>,
 ReferenceTemplateEvent
 > = {
 type: ApplicationTypes.EXAMPLE,
 name: m.name,
 institution: m.institutionName,
 featureFlag: Feature.exampleApplication,
 translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
 dataSchema: ExampleSchema,
```

#### DataSchema

Leverage zod for creating the application schema, allowing custom error messages using translations via the `params` field within error message callbacks.

```typescript
.refine((n) => n && !kennitala.isValid(n), {
  params: m.dataSchemeNationalId,
}),
```

Example: [ReferenceApplicationTemplate](https://github.com/island-is/island.is/blob/main/libs/application/templates/reference-template/src/lib/ReferenceApplicationTemplate.ts#L56).

#### AnswerValidators

Similar to other fields, you can utilize a string or a translatable object from your messages file.

### Application Type

Each application template corresponds to a unique application type, represented in the `ApplicationTypes` enum upon creation.

### Data Schema

To ensure frontend and backend form validation consistency, each application template must include a `dataSchema` created using [Zod](https://github.com/vriad/zod). This object maps question ids to validation criteria and respective error messages.

### Answer Validators

For complex validations beyond a Zod `dataSchema`, utilize answer validators stored as a map with paths to answers requiring custom validation. These run server-side when client updates with designated validators occur.

### State Machine

The `application-core` uses types and interfaces for state machines, extending from [xstate](https://xstate.js.org/docs/). Each state must include a `meta` object detailing state names, accessible roles, and role-based actions.

### States

Applications define their unique [states](https://xstate.js.org/docs/guides/states.html#state-methods-and-properties), varying in complexity based on application flow requirements.

> A state reflects a system's status (e.g., an application) at a specific time, transitioning via events as the system is interacted with. A finite state machine maintains one of a finite number of states at any time.

Examine a simple example from [reference-template](https://github.com/island-is/island.is/blob/287e1769d8fa3f0665ff767a9c82933d0c785fdc/libs/application/templates/reference-template/src/lib/ReferenceApplicationTemplate.ts#L60-L152), or a complex one from [Parental Leave](https://github.com/island-is/island.is/blob/ed3ac581b75862cd5e45d5ee8a6811d40216ac46/libs/application/templates/parental-leave/src/lib/ParentalLeaveTemplate.ts#L30-L41).

#### Status

Applications can assume various statuses:

- `notstarted`: User opened the application; it isn't listed yet (e.g., in prerequisites).
- `draft`: Application created but unsubmitted.
- `inprogress`: Application submitted, awaiting external entity response.
- `completed`: Submitted application needing no further action.
- `rejected`: Application finished, denied by a third party.
- `approved`: Application finished, approved by a third party.

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

Define custom life cycles for states:

```typescript
type StateLifeCycle =
  | {
      shouldBeListed: boolean;
      shouldBePruned: false;
      shouldDeleteChargeIfPaymentFulfilled?: boolean | null;
    }
  | {
      shouldBeListed: boolean;
      shouldBePruned: true;
      whenToPrune: number | ((application: Application) => Date);
      shouldDeleteChargeIfPaymentFulfilled?: boolean | null;
    }
```

States default to non-pruning and constant listing. Default settings reside in `libs/application/core/src/lib/constants.ts`.

**Sample Scenario:**

An application template undergoes logic validation before creation—"created" entails visibility on user pages and application screens (`/umsoknir/:type`) alongside immunity from inactivity-driven pruning.

- Initial state life cycles include `shouldBeListed: false` for non-listing and `shouldBePruned: true` for auto-pruning inactive applications after specified inactivity.

Pruning values, persisted in databases, necessitate simultaneous database migration for published applications upon lifecycle modification.

### Roles

Roles dictate `read` and `write` permissions over application data, alongside unique `formLoader` directives for role-specific form rendering per state. For instance, the `applicant` and `reviewer` forms differ during review states; the `applicant` can be restricted to `read` only, while the `reviewer` may both `read` and `write`.

The backend enforces logic ensuring responses reflect state-appropriate answers for the querying individual.

Roles also enumerate `actions` mapped to events driving state transitions. In the example below, the `applicant` performs no actions during `inReview`, while the `reviewer` can `APPROVE` or `REJECT`, prompting state changes.

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

For each state, optionally define a "pendingAction" to appear as the top application history entry, accompanied by a user prompt. This is not persisted between states.

```typescript
[States.waitingToAssign]: {
  meta: {
    name: 'Waiting to assign',
    ...
    actionCard: {
      pendingAction: {
        title: 'Skráning yfirferðaraðila',
        content:
          'Umsóknin bíður nú þess að yfirferðaraðili sé skráður á umsóknina. Þú getur líka skráð þig sjálfur inn og farið yfir umsóknina.',
        displayStatus: 'warning',
      },
      ...
    },
```

You can also use application answers and user roles to dynamically determine title, content, and status.

```typescript
...
  actionCard: {
    pendingAction: (answers, role) => {
      let title, content, displayStatus;
      if (role === 'applicant') {
        title = 'Waiting for Reviewer';
        content = 'Your application is waiting for a reviewer to be assigned.';
        displayStatus = 'info';
      } else if (role === 'reviewer') {
        title = 'Applications to Review';
        content = 'You have applications waiting to be reviewed.';
        displayStatus = 'warning';
      }

      return { title, content, displayStatus };
    },
...
```

### Application History

Log application event histories for each triggerable event within a state, recorded in order beneath the [Pending Action](#-Pending-Action) (if present), from most recent.

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
      ]
      ...
    }
```

Example history log visualization (if no [Pending Action](#-Pending-Action) exists):

### Delete Application

Allow users to delete applications in a state by adding `delete: true` for desired roles.

```typescript
stateMachineConfig: {
  states: {
    ...
    draft: {
      meta: {
        name: 'Draft',
        roles: [
          {
            id: 'applicant',
            formLoader: () =>
              import('../forms/Draft').then((val) =>
                Promise.resolve(val.Draft),
              ),
            read: 'all',
            delete: true
          },
        ],
      },
    ...
  },
},
```

This adds a delete option for `Applicant` role in Draft state.

## Form

The `Form` type delineates form flow structure—handled by `application-ui-shell` to dictate screen rendering.

The form structure entails question/field presentation order and organization, likened to a root node `Form` down to renderable `Fields`, interspersed with `Sections`, `SubSections`, `MultiFields`, `ExternalDataProviders`, and `Repeaters`.

### Fields

Form fields may constitute questions requiring user answers or serve cosmetic/informational purposes. Prebuilt fields (e.g., TextField, CheckboxField) are available, alongside a customizable field interface. For data schema validation, ensure a field's `id` appears in the template `dataSchema`. Fields can specify a `defaultValue`.

### Creating New Field Components

1. Amend `FieldTypes` and `FieldComponents` enums in `libs/application/types/src/lib/fields.ts` with your field's name.
2. Draft a new interface in `libs/application/types/src/lib/fields.ts` extending `BaseField`, embedding custom properties alongside type and component.

```typescript
export interface NewField extends BaseField {
  readonly type: FieldTypes.NEW_FIELD;
  component: FieldComponents.NEW_FIELD;
  myProp: string;
  myOtherProp: number;
}
```

3. Append the new field to the exported `Field` type.
4. Formulate a new function in `libs/application/core/src/lib/fieldBuilders.ts`, accepting parameters from the newly created `NewField` type, omitting `type`, `component`, and `children`.

```typescript
export const buildNewField = (
  data: Omit<NewField, 'type' | 'component' | 'children'>,
): NewField => {
  const { myProp, myOtherProp } = data;
  return {
    ...extractCommonFields(data),
    children: undefined,
    myProp,
    myOtherProp,
    type: FieldTypes.NEW_FIELD,
    component: FieldComponents.NEW_FIELD,
  };
};
```

5. Establish a directory with the field's name within `libs/application/ui-fields/src/lib/`, alongside a React component sharing the name with a `.tsx` extension.

![Component](/path-to-image.png)

6. Formulate a function in the new file matching the `FieldComponents` enum name from step 1. Props should extend `FieldBaseProps`, incorporating the field type from step 2.

```typescript
interface Props extends FieldBaseProps {
  field: NewField;
}

export const NewFormField: FC<Props> = ({ application, field }) => {
  return <Box>Your new component.</Box>;
};
```

7. Register your component as an export in the parent `index.ts`.
8. Your field component is created and ready for use in application forms.

### Conditions

Fields may feature conditions for conditional visibility, either dynamically (via open-ended functions) or statically (influenced by other question responses).

### Sections and SubSections

Used solely for layout organization, sections and subsections delineate chapters, aiding users in gauging form progress.

### Multi-fields

Serving only cosmetic purposes, these cluster fields for simultaneous rendering by `application-form` UI, which defaults to single-field screens.

### External Data Providers

Frequently, applications require immutable external data, updated solely by backend custom `DataProviders`.

### Custom Errors for Data Providers

Implementing custom error messages for data provider failures allows user feedback upon unmet data requirements:

```typescript
export class SampleDataProvider extends BasicDataProvider {
  type = 'SampleDataProvider';

  async provide(_application: Application): Promise<unknown> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data: SampleProviderData = {
      value: 'Hello world',
    };

    if (!SampleProviderData.value) {
      return Promise.reject({
        reason: {
          title: error.someFailMessage.title,
          summary: error.someFailMessage.summary,
        },
        statusCode: 404,
      });
    }

    return Promise.resolve(data);
  }

  onProvideError(error: {
    reason: ProviderErrorReason;
    statusCode?: number;
  }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure',
      statusCode: error.statusCode,
    };
  }
}
```

This error configuration produces a yellow-box warning upon user data request failure:

### Dynamic Name for Application

For applications requiring dynamic naming based on user responses, replace the `name` string with a function. This function must accept the application object and return a translation string.

```typescript
const determineMessageFromApplicationAnswers = (application: Application) => {
  const careerHistory = getValueViaPath(
    application.answers,
    'careerHistory',
    undefined,
  ) as string | undefined;

  if (careerHistory === 'no') {
    return m.nameApplicationNeverWorkedBefore;
  }
  return m.name;
};
```

```typescript
template: {
  ...
  name: determineMessageFromApplicationAnswers,
  ...
}
```

Application overview and title adapt based on responses, barring personal info in dynamic names.

## Draft Status Bar for Application Action Cards

Outlined below are default and custom draft status bar behaviors. Default behavior doesn't suit all applications due to including all screens, including dynamic ones, in its count.

### Default Draft Status Bar Behavior

- draftFinishedSteps: Defaults to form screens, using current active index.
- draftTotalSteps: Uses screens.length by default.

### Custom Draft Status Bar Behavior

Define custom behavior, utilizing the draftPageNumber for current sections:

- draftFinishedSteps: Relies on draftPageNumber.
- draftTotalSteps: Evaluates sections for maximum draftPageNumber value.
- Overwrite default behavior by assigning draftPageNumbers, ideal for applications with dynamic screens where a single screen from ten dynamic options is rendered.

```typescript
buildSection({
  id: 'id-1',
  title: 'demo-title',
  draftPageNumber: 1,
  children: [],
}),
buildSection({
  id: 'id-2',
  title: 'demo-title',
  draftPageNumber: 2,
  children: [],
}),
buildSection({
  id: 'id-3',
  title: 'payment-transcation',
  draftPageNumber: 3,
  children: [],
  condition: (_formValue) => {
    return _formValue.paymentMethod === "TRANSACTION"
  }
}),
buildSection({
  id: 'id-4',
  title: 'payment-visa',
  draftPageNumber: 3,
  children: [],
  condition: (_formValue) => {
    return _formValue.paymentMethod === "VISA"
  }
}),
```
```