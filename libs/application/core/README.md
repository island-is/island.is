# application-core

This library contains all types, and utilities needed to build applications, forms, and schemas that act as the main base for the whole application system.

## Application

The `application` type describes an instance of a stored application. It includes information about:

- who the `applicant` is
- what is (s)he applying for (`typeId`)
- the needed `answers` to the questions in the application
- the `externalData` attached to the application
- what `state` the application is in
- and more

## Application Template

The `ApplicationTemplate` interface is the heart of the whole system. Each self-service application flow depends on having a template that extends this interface.
Each application template has a unique`type`, a `dataSchema` for quick data validation, a list of external `dataProviders`, and, most importantly,
a `stateMachineConfig` to describe the overall flow for the application, and how users with different roles can interact with an application in its varying states.

### Application Type

Each application template has its own unique application type. When a new application template is created, a respective enum value should be added to the `ApplicationTypes` enum.

### Data schema

In order to have consistent form validation in the frontend and backend, each application template should be accompanied by a `dataSchema`. This `dataSchema` is
implemented using [Zod](https://github.com/vriad/zod) which is a powerful TypeScript-first schema declaration and validation library. The schema is an object, where
the keys are the ids of all the questions that need validation for this given application template, and the value is a zod object describing what validation is needed
for that given question and what error message to show if it fails.

### Data Providers

Many applications need to store external data that cannot be manipulated, but should be stored within the application. This data is often fetched from external sources (via x-road or other services available to island.is) and is used for either prefilling fields in the form, or for validation and information uses.

### State Machine

Behind the scenes, `application-core` has types and interfaces for state machines which are extended from [xstate](https://xstate.js.org/docs/).
Each `state` in the application template state machine must include a `meta` object which describes the name of the state, what `roles` can access it, and what each role can do in said state.

### Roles

Each role can `read` or `write` different data stored in the application. Not only that, but each role has its own `formLoader` to describe what form should be rendered for said role in this specific state.
For example, when an application is in review, the `applicant` should see a different form than the `reviewer`. Also, the `applicant` can no longer `write` any new answers, only `read` them, while a `reviewer` might be able to `read` everything and even `write` some new answers as well.
This logic is also applied by the backend to make sure when a person queries for an application, the answers stored in the database for said application are trimmed so the person only gets to see the answers that (s)he is allowed
to in that state.

In addition to information about which form to load, what data this role can read and write, the role includes a (possibly empty) list of `actions`. Each `action` maps to an event that is used by the state machine to transition into another state. In the example below, the `applicant`
cannot perform any actions in the `inReview` state, while the `reviewer` has all the power to `APPROVE` or `REJECT` the application, resulting in a state transition.

```ts
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

## Form

The `Form` type describes how to structure the flow of a form. It is basically a big json object which is used by `application-ui-shell` to know what to render on the screen.

The structure of a form describes how questions and other fields are displayed, in what section or subsection they belong to, and in what order. It is basically a tree where the root is the `Form`, and the leaves are renderable `Fields`. In between there are nodes that describe the structure in more detail, such as `Sections`, `SubSections`, `MultiFields`, `ExternalDataProviders` and `Repeaters`.

### Fields

A form field can be a question that the applicant needs to answer, or just something purely cosmetic or informational. This library provides prebuilt reusable fields (such as TextField, CheckboxField, RadioField and more), and also an interface for a custom field. In order to get data schema validation for a field, the `id` of the field needs to be present in the application template `dataSchema` object.

### Conditions

Fields can have conditions to be shown/hidden under some given circumstances. These conditions can be _dynamic_ (open-ended function), or _static_ (depend on answers to other questions).

### Sections and SubSections

These are only used for cosmetic reasons. They divide the form flow into meaningful chapters, which allow users to know how far into the form process they are.

### Multi-fields

These are only used for cosmetic reasons. They group fields together so the `application-form` UI renders multiple fields on the screen, instead of the default one field per screen behavior.

### External Data Providers

Many applications rely on external data that should not be editable by any user or consumer of an api. The `externalData` of an application is only updated by the backend via custom-made `DataProviders`.

## Running unit tests

Run `yarn nx test application-core` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `yarn nx lint application-core` to lint
