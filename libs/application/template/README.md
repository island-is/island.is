# application-template

This library contains all types, and utilities needed to build applications, forms, and schemas that are the main base for the whole application system.

## Types

### Application

An application includes information about:

- who the `applicant` is
- what is (s)he applying for (`typeId`)
- the needed `answers` to the questions in the application
- the `externalData` attached to the application
- what `state` the application is in
- and more

### Form

The `Form` type describes how to structure and validate a form. This type is used throughout the whole application system, both frontend and backend.

#### Form validation

In order to have consistent form validation in the frontend and backend, each `Form` should be accompanied by a `schema`. This `schema` is implemented using [Zod](https://github.com/vriad/zod) which is a powerful TypeScript-first schema declaration and validation library. The schema is an object, where the keys are the ids of all the questions that need validation for this given form, and the value is a zod object describing what validation is needed for that given question and what error message to show if it fails.

#### Form structure

The structure of a form describes how questions and other fields are displayed, in what section or subsection they belong to, and in what order. It is basically a tree where the root is the `Form`, and the leaves are renderable `Fields`. In between there are nodes that describe the structure in more detail, such as `Sections`, `SubSections`, `MultiFields`, `ExternalDataProviders` and `Repeaters`.

#### Fields

A form field can be a question that the applicant needs to answer, or just something purely cosmetic or informational. This library provides prebuilt reusable fields (such as TextField, CheckboxField, RadioField and more), and also an interface for a custom field. In order to get schema validation for a field, the `id` of the field needs to be present in the form schema object.

#### Conditions

Fields can have conditions to be shown/hidden under some given circumstances. These conditions can be _dynamic_ (open-ended function), or _static_ (depend on answers to other questions).

#### Sections and SubSections

These are only used for cosmetic reasons. They divide the form flow into meaningful chapters, which allow users to know how far into the form process they are.

#### Multi-fields

These are only used for cosmetic reasons. They group fields together so the `application-form` UI renders multiple fields on the screen, instead of the default one field per screen behavior.

#### External Data Providers

Many applications rely on external data that should not be editable by any user or consumer of an api. The externalData of an application is only updated by the backend via custom-made `DataProviders`.

## How to build a new Form

All forms should be stored in code under `src/forms/**` and exported in `src/forms/index.ts`. The `FormType.ts` file needs to be updated with the new unique type for the form. There are multiple helper functions in `src/lib/formBuilders.ts` that help to build forms faster.

Then run `yarn nx codegen api-domains-application` to update the api layer, so it can create new applications of this type.

## How to build a new Field

Each Field has to have its own unique `type` which needs to be part of the `FieldTypes` enum inside `src/types/Fields.ts`. Then build a new interface that extends `Question` or `BaseField`, add finally add that to the `Field` type.

## Running unit tests

Run `yarn nx test application-template` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `yarn nx lint application-template` to lint
