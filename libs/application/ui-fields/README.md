# UI Fields

This library includes reusable react components for fields in the application system.

## How to build a new Field

Each Field has to have its own unique `type` which needs to be part of the `FieldTypes` enum inside `application/core/src/types/Fields.ts`. Then build a new interface that extends `Question` or `BaseField`, add finally add that to the `Field` type in `application-core`.

## Running unit tests

Run `nx test application-ui-fields` to execute the unit tests via [Jest](https://jestjs.io).
