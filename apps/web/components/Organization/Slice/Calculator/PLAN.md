# Calculator Web Renderer Plan

Audience: implementation agent. `ROADMAP.md` has the rationale; this file is the
execution checklist.

## Goal

Restore the public web `Calculator` slice to a compiling, metadata-driven input
renderer.

This pass does **not** implement calculation execution, submit payload coercion,
or output value rendering. The current API domain exposes metadata only.

## Scope

Change:

- `apps/web/components/Organization/Slice/Calculator/**`
- `apps/web/screens/queries/TaxCalculators.ts`
- regenerated `apps/web/graphql/schema.ts` and `fragmentTypes.json`
- `apps/web/babel-jest.config.json` test-infra exception: set
  `babelrc: false`

Do not change:

- `libs/tax-calculators`
- `libs/api/domains/tax-calculators`
- `apps/contentful-apps`
- CMS model/slice registration
- old `{ sections: [...] }` compatibility

## Current Breaks

- `Calculator.tsx` imports `collectSectionToggles`; use
  `collectInputSectionToggles`.
- `Calculator.tsx` reads `config.sections`; use `config.inputSections`.
- `CalculatorSection.tsx` imports `CalculatorFieldSection`; use
  `CalculatorInputSection`.
- `CalculatorField.tsx` imports `CalculatorSectionField`; use
  `CalculatorInputSectionField`.
- `TaxCalculators.ts` still queries `taxCalculator(calculatorType:)` and
  `fields { inputType ... }`; replace with `taxCalculator(type:)`,
  `inputFields`, and `outputFields`.

## Metadata Query

Put the query in `apps/web/screens/queries/TaxCalculators.ts`. Do not colocate it
in the slice directory: `apps/web/codegen.yml` only scans
`apps/web/screens/queries/*.{ts,tsx}`.

Use the same concrete-fragment and alias pattern as the Contentful editor query:

- fragments on concrete types, not interfaces
- dependency union values aliased as `booleanValue`, `stringValue`,
  `numberValue`
- number `semantic` queried only on number field types
- select `options` queried only on select input fields
- array `itemFields` queried only on array output fields

After changing the query:

```bash
yarn nx run api:codegen/backend-schema
yarn nx run web:codegen/frontend-client
```

`api.graphql`, `apps/web/graphql/schema.ts`, and
`apps/web/graphql/fragmentTypes.json` are generated/gitignored. Regenerate them
locally before verifying.

## Normalizers

Add `contract.ts`.

Responsibilities:

- define `InputContractField`, `OutputContractField`, `OutputContractItemField`
- normalize generated GraphQL unions into flat maps
- collapse `options { value }[]` to `string[]`
- collapse dependency union values to one scalar
- normalize `semantic: null` to `undefined`
- switch only on `__typename`
- close switches with `const unhandled: never = field`

Use the Contentful editor normalizers as the pattern, but do not copy strict-false
runtime assertions. `apps/web` has `strict: true`; `apps/contentful-apps` has
`strict: false`.

Keep normalizers web-local for now. Extract only if a third consumer appears or
the web/editor needs converge.

Dependency comparison remains strict in this pass. Current metadata uses boolean
dependencies. If future metadata needs number/string coercion, that belongs to
the calculation-boundary work.

## Input Rendering

Update `Calculator.tsx`:

- parse `configJson` once with `useMemo`
- use `config.inputSections`
- use `collectInputSectionToggles`
- pass normalized input/output metadata maps
- keep submit disabled
- move development diagnostics into effects, not render

Update `CalculatorSection.tsx`:

- type `section` as `CalculatorInputSection`
- use `Map<string, InputContractField>`
- omit stale field keys
- omit fields with no authored label
- keep toggle/gate behavior
- replace the dead toggle raw-key fallback with a type-safe empty fallback:
  `localized(section.toggle.label, locale) ?? ''`
- remove unused imports

Update `CalculatorField.tsx`:

- type `field` as `CalculatorInputSectionField`
- accept `label: string`
- remove `?? key` label fallback
- use new metadata: `type`, optional `semantic`, optional `options`,
  `dependsOn.fieldKey`
- resolve controls in two stages: field `type` first, number `semantic` second
- explicitly handle plain `NUMBER` with no semantic
- keep `DatePickerController` using the `select` props object; it reads form
  context internally and does not take `control`

Move the `GridColumn` wrapper into `CalculatorField`. Today omitted fields can
leave empty columns because `CalculatorSection` wraps before
`CalculatorField` can return `null`. Moving the wrapper fixes stale-key,
unlabelled, and unmet-dependency omissions.

Add a TODO on percentage controls:

```ts
// TODO(calculation-boundary): UI collects 0-100; RSK expects 0-1.
```

Do not change submit behavior in this pass.

## Label Policy

Decision for this pass:

- if a placed input/output field has no authored label, omit it from public
  rendering
- warn in development only
- never render raw keys as public labels

Future work can tighten the shared schema after existing content is verified.

Use existing `localized()` from `text.ts`; do not add a wrapper that only aliases
it.

## Diagnostics

Add `diagnostics.ts`.

Development-only warnings:

- required input field not placed in `inputSections`
- configured input key missing from metadata
- configured input/output/item field has no authored label
- invalid `configJson` Zod issues, including paths

Use shared collectors where applicable:

- `collectInputFieldKeys`
- `collectOutputFieldKeys`
- `collectOutputItemFieldKeys`

Call diagnostics from `useEffect`. Do not warn from render paths; StrictMode
will double-fire render warnings.

`configJson` parse diagnostics belong in the outer `Calculator` component,
because `CalculatorForm` never mounts when parsing fails.

## Output Metadata Only

Add `outputDiagnostics.ts`.

Do:

- join `config.outputSections` to normalized `outputFields` metadata by key
- warn for stale output keys
- warn for stale array item keys
- warn if `itemFields` are configured on scalar output metadata
- feed output rows into the unlabelled-field diagnostic

Do not add `CalculatorOutput*.tsx` value-rendering components in this pass. The
result value shape depends on the future calculation operation.

## Tests

Prefer pure tests first:

- normalizers
- diagnostics
- output diagnostics

Component tests should cover only behavior pure tests cannot cover:

- invalid config renders nothing and logs Zod issues in dev
- input sections render from `inputSections`
- toggle/gate behavior
- stale input keys omitted
- unlabelled fields omitted and warned
- omitted fields leave no empty `GridColumn`
- each `type`/`semantic` control path, including plain `NUMBER`
- loading shows `SkeletonLoader`
- metadata error shows `AlertMessage`

Testing caveats:

- `apps/web` has little component-test precedent.
- `apps/web/jest.config.ts` has no setup file.
- `@testing-library/jest-dom` matchers are not registered.
- Use native Jest assertions like `getAttribute`, `textContent`, `toBeNull`.
- Do not use `toBeInTheDocument()` unless adding Jest setup, which is out of
  scope.
- `apps/web/babel-jest.config.json` must set `babelrc: false`. The calculator
  component tests import `@island.is/shared/form-fields`; without this, Babel
  also reads that package's `.babelrc`, applies both `@nx/next/babel` and
  `@nx/react/babel`, and fails parsing JSX with duplicate `__self` props.

## Verification

Do not use:

```bash
yarn tsc -p apps/web/tsconfig.json --noEmit
```

It fails on existing project-reference/emit config before checking the
calculator code. `nx test web` also does not type-check; it uses Babel/Jest.

Use:

```bash
yarn nx run api:codegen/backend-schema
yarn nx run web:codegen/frontend-client
yarn nx lint web
yarn nx test web --testPathPatterns=Organization/Slice/Calculator --coverage=false
yarn nx test web --coverage=false
yarn nx build web
```

`yarn nx build web` is the practical type/build gate.
Run the full `web` test target because `babel-jest.config.json` is app-wide test
infrastructure, not slice-local code.

## Implementation Order

1. Update query and regenerate types.
2. Add `contract.ts` normalizers.
3. Update imports and `inputSections` usage.
4. Restore input rendering with normalized `inputFields`.
5. Move `GridColumn` into `CalculatorField`.
6. Add `diagnostics.ts`.
7. Add `outputDiagnostics.ts`.
8. Add focused tests.
9. Run verification.

## Deferred

- Calculation operation: generic `{ type, values }` vs per-calculator typed
  operations.
- Submit payload coercion.
- Percentage conversion: UI 0-100, RSK 0-1.
- Month indexing: current UI emits 1-based months; RSK convention is not pinned.
- Output value components.
- Output formatting helpers.
- Shared schema tightening for required labels.
- Fixing `apps/web` tsconfig project-reference issues.
