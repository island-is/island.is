# SDF Rendering Component Guide

This guide explains how to add a component to the new server-driven forms (SDF) rendering application from the template field definition to a working rendered component.

## Quick Path

For a native SDF field, the frontend rendering step is always:

1. Create `apps/application-system-next/components/form-renderer/fields/SdfMyComponentField.tsx`.
2. Register `SdfMyComponentField` in `apps/application-system-next/components/form-renderer/ComponentSwitch.tsx`.
3. If it must force a full row, add `SdfMyComponentField` to `FULL_ROW_TYPES` in `apps/application-system-next/components/form-renderer/layout.ts`.

`apps/application-system-next/components/FormRenderer.tsx` is the public orchestration entry point. Do not add field-specific JSX there.

## How The Pipeline Works

The SDF renderer is split across four layers:

1. Application templates emit legacy form AST fields, usually through `FormBuilder` or `build*Field` helpers.
2. `apps/application-system/api/src/app/modules/sdf` compiles the active screen and maps each field into a REST `ComponentDto`.
3. `libs/api/domains/application/src/lib/sdf.model.ts` exposes those REST components as a GraphQL union.
4. `apps/application-system-next/components/FormRenderer.tsx` orchestrates frontend layout, and `apps/application-system-next/components/form-renderer/fields` renders the GraphQL payload in the Next.js application.

The discriminating value is the backend component `type`, for example `TEXT`, `SELECT`, or `DATA_TABLE`. GraphQL maps that value to a typename like `SdfTextField`, and `ComponentSwitch.tsx` dispatches by `component.__typename` to the matching field file.

## Choose The Right Path

Use an existing native component when the field already exists in `FieldTypes` and only needs more mapped props or rendering polish.

Use a new native SDF component when the field should be reusable across many applications and can be represented as serializable data.

Use a custom component only as an escape hatch for application-specific UI that does not belong in the generic renderer. Custom components must validate props with Zod and need explicit write approval if they update answers.

## Add A Native SDF Component

### 1. Define Or Reuse The Field Type

Check `libs/application/types/src/lib/Fields.ts`.

If the field type already exists in `FieldTypes`, reuse it. If the legacy application system has no field type for your component yet, add the enum value and matching field interface there first. Keep this library environment-neutral: types only, no React and no Node-specific code.

Example:

```ts
export enum FieldTypes {
  MY_COMPONENT = 'MY_COMPONENT',
}
```

If templates should create the field through the fluent API, add or extend the relevant builder in `libs/application/core`. Keep builder code shared and environment-neutral.

### 2. Emit The Field From A Template

Use the application template form definition to place the field on a page. The field id should match the answer key if it collects input.

```ts
page.addTextField('applicant.email', 'Email', {
  variant: 'email',
  required: true,
})
```

For new field types, follow the existing field shape in `Fields.ts`: include `id`, `type`, `component`, `title`, and only serializable props that can cross REST and GraphQL.

### 3. Map The Field To `ComponentDto`

Add a mapper under:

`apps/application-system/api/src/app/modules/sdf/field-mappers`

Use the local mapper pattern:

```ts
import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapMyComponentField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  component.message = resolver.resolve(asResolvableFormText(raw.message))
  component.disabled = resolveFieldProp(raw.disabled, application) ?? false
}
```

Then register it in `field-mappers/index.ts`:

```ts
const fieldMappers: Partial<Record<FieldTypes, FieldMapper>> = {
  [FieldTypes.MY_COMPONENT]: mapMyComponentField,
}
```

`createBaseComponent()` already maps shared props such as `id`, `type`, `label`, `required`, `disabled`, `defaultValue`, `width`, and `clientCondition`. Only map props that are specific to your component.

### 4. Add REST DTO Props

Expose any new transport fields on `ComponentDto`:

`apps/application-system/api/src/app/modules/sdf/dto/screen.dto.ts`

Use concrete property names and `@ApiPropertyOptional()` so the OpenAPI client can generate them.

```ts
@ApiPropertyOptional()
myComponentMessage?: string
```

Avoid ambiguous generic names when different component types use different meanings. For example, text number bounds use `textNumberMin` and `textNumberMax` instead of overloading slider `min` and `max`.

### 5. Add The GraphQL Type

Update `libs/api/domains/application/src/lib/sdf.model.ts`.

Add an object type:

```ts
@ObjectType('SdfMyComponentField')
export class SdfMyComponentField {
  @Field()
  id!: string

  @Field()
  myComponentMessage!: string
}
```

Then add it to:

```ts
const allComponentTypes = () => [
  SdfMyComponentField,
] as const
```

And map the REST discriminator to the GraphQL type:

```ts
const typeMap: Record<string, new () => unknown> = {
  MY_COMPONENT: SdfMyComponentField,
}
```

### 6. Query The New Fields

Update the GraphQL selection in:

`apps/application-system-next/lib/graphql.ts`

Add an inline fragment under `page.components`:

```graphql
... on SdfMyComponentField {
  id
  myComponentMessage
}
```

Also extend `SdfComponentData` in the same file with the fields the renderer reads.

### 7. Render The Component

Create the field renderer under:

`apps/application-system-next/components/form-renderer/fields/SdfMyComponentField.tsx`

Render from the shared field props:

```tsx
import { Box, Text } from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

export const SdfMyComponentField = ({ component }: FieldRendererProps) => (
  <Box marginBottom={3}>
    <Text>{component.myComponentMessage}</Text>
  </Box>
)
```

For input components, read the current value from `answers[component.id]` and update through `handleChange(value)`. Do not store authoritative answer state inside the component.

Then register it in:

`apps/application-system-next/components/form-renderer/ComponentSwitch.tsx`

```tsx
import { SdfMyComponentField } from './fields/SdfMyComponentField'

const fieldRenderers = {
  SdfMyComponentField,
}
```

For layout, prefer the existing SDF layout tokens:

`apps/application-system-next/components/sdfLayoutTokens.ts`

If the component should always take a full row, add its typename to `FULL_ROW_TYPES` in `apps/application-system-next/components/form-renderer/layout.ts`.

### 8. Add Tests

Add a backend mapper test under:

`apps/application-system/api/src/app/modules/sdf/__tests__`

Follow examples like:

`screen-mapper-text-field.spec.ts`

At minimum, prove that the form AST maps to the expected `ComponentDto` props.

If the component has frontend behavior, add or extend a frontend test near `apps/application-system-next/components` or `apps/application-system-next/hooks`.

### 9. Verify The Full Path

Run focused tests first:

```bash
yarn nx test application-system-api --testFile=apps/application-system/api/src/app/modules/sdf/__tests__/screen-mapper-my-component.spec.ts
```

Then build the affected apps:

```bash
yarn nx build application-system-api
yarn nx build application-system-next
```

If GraphQL schema or generated fetch types are stale, regenerate the project’s API artifacts using the existing repository scripts before rerunning the builds.

## Add A Custom Component Escape Hatch

Custom components use `FieldTypes.CUSTOM` and are rendered through the frontend registry. Choose this path only when a generic native SDF component would create the wrong abstraction.

### 1. Emit A Custom Field

The backend mapper serializes custom component props into:

```ts
{
  type: 'CUSTOM',
  componentName: 'MyCustomComponent',
  props: '{"someProp":"value"}'
}
```

Keep props JSON-serializable. Do not pass functions, React nodes, class instances, or services.

### 2. Register The Component

Update:

`apps/application-system-next/components/registry.ts`

```ts
const registry: Record<string, RegistryEntry> = {
  MyCustomComponent: {
    component: dynamic(() => import('./custom/MyCustomComponent')),
    propsSchema: z.object({
      someProp: z.string(),
    }),
  },
}
```

Create the component under:

`apps/application-system-next/components/custom`

The renderer passes `componentName`, validated props, and sometimes `onAnswerChange`.

### 3. Allow Writes Only When Reviewed

Custom components are read-only by default. If a custom component must update answers, add its name to `ALLOWED_CUSTOM_COMPONENT_NAMES` in `registry.ts`.

Only do this after confirming:

- The backend schema validates the answer shape.
- The component writes through `onAnswerChange(fieldId, value)`.
- The answer key is owned by the current page/application.
- The behavior works through normal SDF actions (`VALIDATE`, `REFETCH`, `NEXT_PAGE`, `SUBMIT`).

## REFETCH And Live Data

If a component needs to update options or dependent display data without submitting the application, use `REFETCH`.

Backend mappers can add:

```ts
component.onSelectRefetchTemplateApis = ['lookupSomething']
component.refetchTargets = ['dependentFieldId']
```

The frontend dispatches a `REFETCH` action. The backend recomputes the screen with an in-memory answer snapshot and runs allowed template API actions through the ephemeral path. `REFETCH` must not persist answers, page index, or external data.

For display-only recalculation without fetching external data, use `VALIDATE`; it can return `displayValues` for the current page without returning a full screen.

## Checklist

- The field type exists in `FieldTypes` or uses `CUSTOM`.
- The template emits a serializable field definition.
- The SDF backend mapper copies all required props into `ComponentDto`.
- `ComponentDto` documents new REST props.
- `sdf.model.ts` exposes a GraphQL object type and maps the REST `type`.
- `apps/application-system-next/lib/graphql.ts` queries the new fields.
- `SdfComponentData` includes the fields used by React.
- `apps/application-system-next/components/form-renderer/fields/Sdf*Field.tsx` renders the `Sdf*Field` typename.
- `apps/application-system-next/components/form-renderer/ComponentSwitch.tsx` registers the field renderer.
- Input writes use `onAnswerChange`, not local authoritative state.
- Tests cover the mapper and any risky renderer behavior.
- `application-system-api` and `application-system-next` build successfully.

