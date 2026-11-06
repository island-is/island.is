# application/sdf-types

Constants shared by the Server-Driven Forms (SDF) API, its GraphQL layer and
`apps/application-system-next`:

- `SdfComparators`: comparator strings shared by the server's condition hints
  and the client's condition evaluation.
- The field-type contract, below.

## Field-type contract

`FIELD_TYPE_TO_GRAPHQL_TYPENAME` (`src/sdfFieldTypesContract.ts`) maps every
`FieldTypes` value to the GraphQL `__typename` SDF returns for it. A field
passes through three layers that are maintained separately:

1. **API:** a field mapper in
   `apps/application-system/api/src/app/modules/sdf/field-mappers/` builds the
   field's screen JSON. Types without a mapper get only the base properties.
2. **GraphQL:** `resolveComponentType` in
   `libs/api/domains/application/src/lib/sdf.model.ts` picks the `__typename`.
3. **Renderer:** `ComponentSwitch.tsx` in `apps/application-system-next` picks
   a component by `__typename`, or shows a placeholder for types listed in
   `unsupportedFieldTypes`.

A type that one layer doesn't know about renders nothing, without an error.
The contract is checked by:

- TypeScript: the map is a `Record<FieldTypes, string>`, so a new `FieldTypes`
  value doesn't compile until it's added.
- `sdf-field-type-routing.spec.ts` (`libs/api/domains/application`):
  `resolveComponentType` returns the contract's typename for every type.
- `formRendererFieldContract.spec.ts` (`apps/application-system-next`): every
  typename in the contract appears in `ComponentSwitch.tsx`. It's a text
  search, so it shows the name is there, not that it renders.

### Adding a new `FieldTypes` value

Until SDF supports the new type:

1. `sdf.model.ts`: add an `@ObjectType('Sdf<Name>Field')` class (copy an
   unsupported one, e.g. `SdfFindVehicleField`), and add it to the
   `SdfComponent` union and to `typeMap` in `resolveComponentTypeByName`.
2. `sdfFieldTypesContract.ts`: add the type to
   `FIELD_TYPE_TO_GRAPHQL_TYPENAME`.
3. `ComponentSwitch.tsx`: add the typename to `unsupportedFieldTypes`.

A template using the type then shows the unsupported-field placeholder
instead of nothing. Implementing the type for real is covered by the
`migrate-to-sdf` skill ("four layers").
