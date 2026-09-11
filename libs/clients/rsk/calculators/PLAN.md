# RSK Calculators Client Output Flow — Implementation Plan

Scope: `ROADMAP.md` Sections 6-7, in `libs/clients/rsk/calculators` only.
Intent: extend the rebuilt client with a curated output contract and response
mappers. No NX scaffolding.

Read `DESIGN.md` first; it is the authority on boundaries. This plan is the
file-by-file execution for the client output flow only.

## Pre-Implementation Documentation

Before changing source, update `DESIGN.md`'s Output Flow section from checkpoint
language to settled v1 design. Record these decisions and rejected alternatives:

- output is part of the full `getCalculator(key)` contract, not a separate
  `getCalculatorOutput(key)` lookup
- output fields are stable English client keys, not RSK-native property names
- output fields are addressable data, not layout groups
- v1 supports scalar and array fields, not nested object groups
- output fields do not have `required`
- scalar output values expose no `null`
- array output values fall back to `[]`

Four further `DESIGN.md` sections go stale in the same round and must be updated
with it. The Output Flow section is not the only one that describes the old
contract:

| Section | What is stale |
|---|---|
| Client Contract | still declares `CalculatorContract { key; fields }` |
| Module Shape | file tree omits `contracts/output.ts`, `contracts/byName.ts`, and `domains/*/<calculator>Output.ts` |
| Field Ordering | pins the inline comparator this plan extracts to `byName` |
| Non-Goals | "Do not implement the output contract until the nested/table result questions are settled" becomes false once this round lands |

Also correct `DESIGN.md`'s decision-log path. It is written as the iCloud
container path; the canonical path for this workspace is
`/Users/mani/obsidian-hxm/digital-iceland/rsk-calculators-notes/`. Both resolve
to the same files today.

Also update the Obsidian decision log before implementation. Append the
contract-shape and boundary decisions to
`client-rebuild-decision-log.md`, and add an `output-contract-registry.md`
beside `input-contract-registry.md`. Keep reasoning in the registry; keep field
tables in this plan and in code.

## Goal Checkpoint

```text
Goal: add a client-owned output flow that mirrors the explicit input contract.
Current phase: implement the v1 custom output contract.
Non-goals: no GraphQL shape, no Contentful config shape, no frontend rendering, no public/domain identities in the client.
Next action: add output contract primitives in contracts/output.ts because output fields have different metadata from input fields and withholding tax requires arrays in v1.
```

## Settled Decisions

- Output keys are stable English client names, not raw RSK response property
  names.
- Echoed RSK display text and echoed RSK codes must be named by value shape, not
  by the input field name they resemble. Use `Label` for RSK display text such
  as `hjuskaparstada?: string | null` and `timabil?: string | null`; use `Code`
  for coded numeric values such as withholding tax `hjuskaparstada?: number`.
- Output ratio fields that represent RSK-applied numeric ratios must not reuse
  input select field names whose accepted values are percentage strings. Use
  `applied*Ratio` to distinguish applied numeric output from submitted string
  input.
- `getCalculator(key)` returns the full machine-readable calculator contract:
  `inputFields` and `outputFields`.
- Existing calculation methods return mapped client outputs once the output
  contract lands. Preserve current generated-client absence behavior: if
  generated `data` is `undefined`, the service returns `undefined`; otherwise it
  returns the mapped `*Output`.
- Raw generated `Get*Response` types are removed from the public export surface.
- V1 output supports scalar fields and array fields. It does not support layout
  groups.
- Array fields use inline `itemFields` in the contract.
- Output field order is not meaningful. The service sorts output fields by
  `name` using the same code-unit comparator as input fields. Array
  `itemFields` are sorted the same way.
- Mapped output exposes no `null`. Scalar fields are optional and are omitted or
  set to `undefined` when RSK returns `undefined` or `null`. Array fields are
  always arrays and fall back to `[]`.
- Output fields do not have `required`; availability is represented by the
  mapped output value shape.
- Numeric `semantic: 'count'` is only for numbers that mean "how many of a
  thing". Do not use it for numeric codes.
- Output contracts do not expose RSK source keys. Source traceability lives in
  response mapper code and tests.
- The client does not runtime-validate output contracts. Authored data plus
  focused tests are the safety net.
- Output contract primitives live in `src/lib/contracts/output.ts`.
- Response mappers live in separate files, one per calculator.

## Current Response Shapes

Generated source: `gen/fetch/types.gen.ts`.

Top-level scalar-only enough for v1:

- `ChildBenefitResult`
- `VehicleBenefitResult`
- `VehicleDepreciationResult`
- `InterestBenefitResult`

Nested or repeated responses that must be handled deliberately:

- `VehicleTaxResult.fyrraTimabil` and `VehicleTaxResult.seinnaTimabil` are
  nested `VehicleTaxPeriodSplit` objects. V1 does not add layout groups. Flatten
  these into stable scalar output keys if they are exposed.
- `WithholdingTaxResult.skattthrep` is `Array<TaxBracket> | null` and is
  required for v1. Expose it as an array output field named `taxBrackets`.

`TaxBracket` contains `bigint` fields:

- `nedriMork`
- `numerThreps`
- `reiknudStadgreidsla`

Map these to numbers in the curated output with a guarded helper. The rest of
the calculator output surface uses numbers, and downstream formatting expects
numeric values rather than `bigint`.

Put this helper at `src/lib/utils/toNumber.ts`, beside the existing
`toRskValue.ts`; without a named home each of the six mappers inlines its own.
Use `== null`, not a truthiness check, because `0n` is a valid value:

```ts
const toNumber = (
  value: bigint | number | null | undefined,
): number | undefined => (value == null ? undefined : Number(value))
```

## Contract Shape

Add `src/lib/contracts/output.ts`:

```ts
import type { CalculatorFieldSemantic } from './field'

export type CalculatorOutputField =
  | CalculatorScalarOutputField
  | CalculatorArrayOutputField

export type CalculatorOutputScalarType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'

export interface CalculatorScalarOutputField {
  name: string
  kind: 'scalar'
  type: CalculatorOutputScalarType
  semantic?: CalculatorFieldSemantic
}

export interface CalculatorArrayOutputField {
  name: string
  kind: 'array'
  itemFields: readonly CalculatorScalarOutputField[]
}
```

Update `src/lib/contracts/field.ts`:

```ts
export interface CalculatorContract<TKey extends string = string> {
  key: TKey
  inputFields: readonly CalculatorField[]
  outputFields: readonly CalculatorOutputField[]
}
```

Import `CalculatorOutputField` from `contracts/output`. The old `fields`
property is renamed to `inputFields`.

Add `src/lib/contracts/byName.ts`:

```ts
export const byName = <T extends { name: string }>(a: T, b: T): number =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
```

Use this comparator everywhere the client sorts input or output contract fields.
Do not duplicate the inline comparator now that it applies to input fields,
output fields, and array `itemFields`.

It lives in `contracts/` rather than the existing `utils/` because deterministic
ordering is part of the contract boundary, not a general-purpose utility -
`DESIGN.md`'s Field Ordering section treats the comparator as contract behavior
and forbids `localeCompare` here. Recorded because `DESIGN.md`'s Decision
Discipline requires a reason for any shared helper.

Author output fields with `as const satisfies`, same as the input contracts:

```ts
const withholdingTaxOutputFields = [
  {
    name: 'monthlySalary',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'maritalStatusCode', kind: 'scalar', type: 'number' },
  {
    name: 'taxBrackets',
    kind: 'array',
    itemFields: [
      {
        name: 'lowerBound',
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      { name: 'bracketNumber', kind: 'scalar', type: 'number' },
      {
        name: 'withholdingRate',
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      {
        name: 'calculatedWithholding',
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
    ],
  },
] as const satisfies readonly CalculatorOutputField[]

export const withholdingTaxCalculator = {
  key: 'withholdingTax',
  inputFields: withholdingTaxInputFields,
  outputFields: withholdingTaxOutputFields,
} as const satisfies CalculatorContract<'withholdingTax'>
```

Derive output field metadata from the per-calculator tables mechanically:

- `currency`, `percentage`, `year`, `month`, or `count` -> `type: 'number'`
  with that `semantic`
- `string` or `boolean` -> that scalar `type`, with no `semantic`
- `number` -> `type: 'number'`, with no `semantic`
- `date` is part of `CalculatorOutputScalarType` but unused in v1; the only
  generated Date values live in `VehicleTaxPeriodSplit`, which v1 excludes

## File Changes

| File/Module | What & why |
|---|---|
| `src/lib/contracts/output.ts` (new) | Output contract primitives. Kept separate from `field.ts` because output has `kind`, arrays, no `required`, no options, and no dependencies. |
| `src/lib/contracts/byName.ts` (new) | Shared code-unit comparator for input fields, output fields, and array `itemFields`. |
| `src/lib/contracts/field.ts` | Rename `CalculatorContract.fields` to `inputFields`; add `outputFields`. This makes `getCalculator(key)` the full calculator contract. |
| `src/lib/contracts/registry.ts` | Update registry members after every calculator contract gains `inputFields` and `outputFields`. No `TaxCalculatorType`. |
| `src/lib/calculators.service.ts` | `getCalculator` returns sorted `inputFields` and sorted `outputFields`; calculation methods call RSK and then response mappers, returning curated `*Output | undefined` types. |
| `src/index.ts` | Export output contract types, six `*Output` types, and `WithholdingTaxBracketOutput`. Remove public exports of raw generated `Get*Response` types. |
| `src/lib/domains/*/contract.ts` (renamed from `schema.ts`) | Rename `<calculator>Fields` to `<calculator>InputFields`; add `<calculator>OutputFields`; add explicit `<Calculator>Output` interfaces. Keep labels/layout out. |
| `src/lib/domains/*/<calculator>Output.ts` (new) | Response mapper from generated RSK result to curated output. Separate from input query mapper. |
| `src/lib/domains/*/index.ts` | Export output fields through the calculator contract, output type, and response mapper. |
| `src/lib/domains/*/<calculator>.spec.ts` | Extend existing contract tests for `inputFields`; add or import output contract fixture checks. |
| `src/lib/domains/*/<calculator>Output.spec.ts` (new or colocated) | Mapper tests for exact output keys and representative values. |
| `README.md` | Replace "output not implemented" with the final output contract and mapped-return behavior. |
| `DESIGN.md` / `ROADMAP.md` | Update from checkpoint language to implemented v1 decisions once code lands. |
| `libs/api/domains/tax-calculators` mechanical follow-through | The client rename `CalculatorContract.fields` -> `inputFields` breaks current domain imports/usages. Include the three mechanical domain fixes for this rename so the repo does not stay red for a purely mechanical contract-name change. Do not design or implement domain output/calculation here. |

## Service Shape

`calculators.service.ts` gains two imports alongside its existing
`CalculatorContract` / `CalculatorKey` ones:

```ts
import { byName } from './contracts/byName'
import type { CalculatorOutputField } from './contracts/output'
```

`getCalculator` must sort copies at each level:

```ts
getCalculator(key: CalculatorKey): CalculatorContract<CalculatorKey> {
  const calculator = calculatorRegistry[key]

  if (!calculator) {
    throw new Error(`Unknown calculator key: ${key}`)
  }

  const outputFields: readonly CalculatorOutputField[] = calculator.outputFields

  return {
    key: calculator.key,
    inputFields: [...calculator.inputFields].sort(byName),
    outputFields: [...outputFields]
      .map((field) =>
        field.kind === 'array'
          ? { ...field, itemFields: [...field.itemFields].sort(byName) }
          : field,
      )
      .sort(byName),
  }
}
```

Response mappers take non-undefined generated results. The service handles
generated `data` absence once:

```ts
async getChildBenefit(input: ChildBenefitInput) {
  const { data } = await getChildBenefit({
    query: toChildBenefitQuery(input),
  })
  return data && toChildBenefitOutput(data)
}
```

Use `?? undefined`, not `|| undefined`, so legitimate `0` values survive:

```ts
import type { ChildBenefitResult } from '../../../../gen/fetch'
import type { ChildBenefitOutput } from './schema'

export const toChildBenefitOutput = (
  result: ChildBenefitResult,
): ChildBenefitOutput => ({
  maritalStatusLabel: result.hjuskaparstada ?? undefined,
  upperReductionThreshold: result.efriSkerdingarmork ?? undefined,
})
```

## Export Surface

Export all public output contract and output value types directly from
`src/index.ts`:

```ts
export type {
  CalculatorArrayOutputField,
  CalculatorOutputField,
  CalculatorOutputScalarType,
  CalculatorScalarOutputField,
} from './lib/contracts/output'
export type { ChildBenefitOutput } from './lib/domains/childBenefit'
export type { InterestBenefitOutput } from './lib/domains/interestBenefit'
export type { VehicleBenefitOutput } from './lib/domains/vehicleBenefit'
export type { VehicleDepreciationOutput } from './lib/domains/vehicleDepreciation'
export type { VehicleTaxOutput } from './lib/domains/vehicleTax'
export type {
  WithholdingTaxBracketOutput,
  WithholdingTaxOutput,
} from './lib/domains/withholdingTax'
```

Remove the current raw generated `Get*Response` export block.

## Rename Sites

Client reads of `CalculatorContract.fields` to update:

- `src/lib/calculators.service.ts:38`
- `src/lib/calculators.service.spec.ts:7`
- `src/lib/calculators.service.spec.ts:18`
- `src/lib/calculators.service.spec.ts:21`
- `src/lib/domains/childBenefit/childBenefit.spec.ts:7`
- `src/lib/domains/interestBenefit/interestBenefit.spec.ts:7`
- `src/lib/domains/vehicleBenefit/vehicleBenefit.spec.ts:7`
- `src/lib/domains/vehicleDepreciation/vehicleDepreciation.spec.ts:7`
- `src/lib/domains/vehicleTax/vehicleTax.spec.ts:7`
- `src/lib/domains/withholdingTax/withholdingTax.spec.ts:7`
- `src/lib/domains/withholdingTax/withholdingTax.spec.ts:85`

Mechanical domain follow-through for the rename:

- `libs/api/domains/tax-calculators/src/lib/tax-calculators.service.ts:29`:
  `contract.fields.map(toInputField)` -> `contract.inputFields.map(toInputField)`
- `libs/api/domains/tax-calculators/src/lib/validation/inputContract.ts:160`,
  `:164`, `:175`, `:178`: read `contract.inputFields`
- `libs/api/domains/tax-calculators/src/lib/validation/inputContract.spec.ts:12`:
  helper contracts become `{ key, inputFields: fields, outputFields: [] }`

Documentation that embeds the old property and must be updated with it:

- `libs/api/domains/tax-calculators/PLAN.md:232`: its file table contains
  `{ type, inputFields: contract.fields.map(toInputField) }`. Prose, not code,
  but it is a live plan a later round executes from.

Do not change `mappings/inputField.ts` or `mappings/calculatorType.ts` for this
rename; they import field-level types and `CalculatorKey`, not
`CalculatorContract.fields`. Do not add domain output validation in this round.

## Per-Calculator Output Direction

The key names below are the planned client output contract. Change one only with
a recorded reason, such as a generated response comment, an existing client input
name, or a clearer client-side semantic.

### Child Benefit

Map scalar fields from `ChildBenefitResult`.

Examples:

- `hjuskaparstada` -> `maritalStatusLabel`, string
- `fjoldiBarna` -> `numberOfChildren`, count
- `fjoldiBarnaUndir7ara` -> `numberOfChildrenUnder7`, count
- `tekjuar` -> `incomeYear`, year
- `botaAr` -> `benefitYear`, year
- `tekjustofn` -> `incomeBase`, currency
- `skerdingarhlutfall` -> `reductionRate`, percentage
- `skerdingarmork` -> `reductionThreshold`, currency
- `efriSkerdingarmork` -> `upperReductionThreshold`, currency
- `stofnTilSkerdingar` -> `reductionBase`, currency
- `stofnTilUmframskerdingar` -> `excessReductionBase`, currency
- `skerdingVegnaTekna` -> `incomeReduction`, currency
- `umframskerdingVegnaTekna` -> `excessIncomeReduction`, currency
- `umframskerdingarhlutfall` -> `excessReductionRate`, percentage
- `oskertarBarnabaetur` -> `unreducedChildBenefit`, currency
- `barnabaeturPerBarn` -> `childBenefitPerChild`, currency
- `barnabaeturAlls` -> `totalChildBenefit`, currency
- `greidslurArsfjordungi` -> `quarterlyPayments`, currency
- `tekjutengdarBarnabaetur` -> `incomeRelatedChildBenefit`, currency
- `barnabaeturAllsPrHjon` -> `totalChildBenefitPerCouple`, currency
- `vidbotBornYngriEn7ara` -> `additionalBenefitForChildrenUnder7`, currency
- `vidbotPerBarnYngraEn7ara` -> `additionalBenefitPerChildUnder7`, currency
- `skerdingUndir7ara` -> `reductionForChildrenUnder7`, currency
- `skerdingarhlutfallUndir7ara` -> `reductionRateForChildrenUnder7`, percentage
- `faedingararBarna` -> `childrenBirthYears`, string
- `skiptBuseta` -> `splitCustody`, boolean
- `skiptYfir7ara` -> `splitCustodyChildrenOver7`, count
- `skiptUndir7ara` -> `splitCustodyChildrenUnder7`, count
- `barnabaeturFyrirSkiptingu` -> `childBenefitBeforeSplit`, currency

### Vehicle Tax

Expose top-level scalar fields only. `fyrraTimabil` and `seinnaTimabil` are
nested period breakdowns and are out of v1 because the client output contract
does not add layout groups or nested object groups. If a later output design
needs them, add stable prefixed scalar keys or an explicit structural primitive
with a recorded reason.

Examples:

- `timabil` -> `periodLabel`, string
- `gjaldar` -> `feeYear`, year
- `eiginthyngd` -> `vehicleWeight`, number
- `co2` -> `co2`, number
- `nedc` -> `nedc`, number
- `wltp` -> `wltp`, number
- `bifreidagjold` -> `vehicleTax`, currency
- `urvinnslugjald` -> `recyclingFee`, currency
- `bifreidagjoldAlls` -> `totalVehicleTax`, currency

### Vehicle Benefit

This calculator is scalar-only. The Figma result's assumptions/prose block is
downstream content, not client output.

- `kaupar` -> `purchaseYear`, year
- `kaupverd` -> `purchasePrice`, currency
- `arshlunnindi` -> `annualBenefit`, currency
- `manadarhlunnindi` -> `monthlyBenefit`, currency

### Vehicle Depreciation

Scalar-only.

- `kaupreikningur` -> `hasPurchaseInvoice`, boolean
- `verd` -> `price`, currency
- `vsk` -> `vat`, currency
- `alagning` -> `markup`, currency
- `vorugjald` -> `exciseFee`, currency
- `vatrygging` -> `insurance`, currency
- `flutningsgjald` -> `transportFee`, currency
- `fyrstu12Manudir` -> `first12MonthsDepreciation`, currency
- `naestu24Manudir` -> `next24MonthsDepreciation`, currency
- `rest` -> `remainingValue`, currency
- `totalFyrning` -> `totalDepreciation`, currency
- `finalAmount` -> `finalAmount`, currency

### Withholding Tax

Must include `taxBrackets`.

Scalar examples:

- `manadarlaun` -> `monthlySalary`, currency
- `lifeyrisjodurProsenta` -> `appliedPensionFundRatio`, percentage
- `sereignProsenta` -> `appliedPrivatePensionRatio`, percentage
- `lifeyrissjodur` -> `pensionFundPayment`, currency
- `sereignarsjodur` -> `privatePensionPayment`, currency
- `fradratturAlls` -> `totalDeductions`, currency
- `personuafslattur` -> `personalTaxCredit`, currency
- `personuafslatturFraMaka` -> `spousePersonalTaxCredit`, currency
- `skattstofn` -> `taxBase`, currency
- `reiknudStadgreidsla` -> `calculatedWithholding`, currency
- `greiddStadgreidsla` -> `paidWithholding`, currency
- `hatekjuskattur` -> `highIncomeTax`, currency
- `reiknadiHatekjuskatt` -> `highIncomeTaxApplied`, boolean
- `utborgudLaun` -> `salaryAfterDeductions`, currency
- `uppsafnadurPersonuafslattur` -> `accumulatedPersonalTaxCredit`, currency
- `tekjuar` -> `incomeYear`, year
- `hjuskaparstada` -> `maritalStatusCode`, number
- `launamanudur` -> `payMonth`, month
- `fritekjumarkBarns` -> `childIncomeLimit`, currency
- `faedingararBarns` -> `childBirthYear`, year
- `stadgreidsluhlutfall` -> `withholdingRate`, percentage
- `motframlag` -> `employerPensionMatch`, currency
- `tryggingagjaldsstofn` -> `payrollTaxBase`, currency
- `tryggingagjald` -> `payrollTax`, currency

Array:

```ts
export interface WithholdingTaxBracketOutput {
  lowerBound?: number
  bracketNumber?: number
  withholdingRate?: number
  calculatedWithholding?: number
}

export interface WithholdingTaxOutput {
  // scalar fields...
  taxBrackets: WithholdingTaxBracketOutput[]
}
```

Map:

- `skattthrep[].nedriMork` -> `lowerBound`, currency
- `skattthrep[].numerThreps` -> `bracketNumber`, number
- `skattthrep[].stadgreidsluhlutfall` -> `withholdingRate`, percentage
- `skattthrep[].reiknudStadgreidsla` -> `calculatedWithholding`, currency

Use the guarded `toNumber` helper for `bigint` fields.

Known gap: percentage scale is not verified for output fields. RSK documents
ratio inputs as values between 0 and 1, but this plan does not assert whether
output fields such as `appliedPensionFundRatio`, `withholdingRate`,
`reductionRate`, and the interest-benefit reduction rates arrive as `0.04` or
`4`. Record the output half beside the existing percentage-conversion deferred
item before implementation, and write mapper tests from observed/generated
fixtures rather than assuming a scale.

### Interest Benefit

Scalar-only.

- `hjuskaparstada` -> `maritalStatusLabel`, string
- `tekjuar` -> `incomeYear`, year
- `botaar` -> `benefitYear`, year
- `hamarkVaxtagjalda` -> `maximumInterestExpenses`, currency
- `vaxtagjoldTilUtreiknings` -> `interestExpensesForCalculation`, currency
- `tekjustofn` -> `incomeBase`, currency
- `eignastofn` -> `assetBase`, currency
- `eftirstodvar` -> `loanBalance`, currency
- `vaxtagjold` -> `interestExpenses`, currency
- `hamarkVaxtabota` -> `maximumInterestBenefit`, currency
- `skerdingVegnaTekna` -> `incomeReduction`, currency
- `vaxtabaeturEftirSkerdinguTekna` -> `interestBenefitAfterIncomeReduction`, currency
- `tekjuskerdingarhlutfall` -> `incomeReductionRate`, percentage
- `skuldaskerdingarhlutfall` -> `debtReductionRate`, percentage
- `skerdingVegnaEigna` -> `assetReduction`, currency
- `eignaskerdingarhlutfall` -> `assetReductionRate`, percentage
- `skerdingLog2003` -> `reductionLaw2003`, currency
- `skerdingLog2004` -> `reductionLaw2004`, currency
- `vaxtabaeturAlls` -> `totalInterestBenefit`, currency
- `serstokVaxtanidurgreidsla` -> `specialInterestReimbursement`, currency
- `nadiHamarki` -> `reachedMaximum`, boolean
- `varUndirLamarki` -> `wasBelowMinimum`, boolean

## Sequencing

0. Update `DESIGN.md` and the Obsidian decision log as described above.
1. Add `contracts/output.ts`.
2. Add `contracts/byName.ts` and update the existing input sort to use it.
3. Update `CalculatorContract` from `fields` to `inputFields`/`outputFields`.
4. Update each existing calculator schema to use `inputFields` and add empty
   `outputFields` only temporarily if needed for compilation.
5. Update `getCalculator` sorting for both input and output fields, including
   array `itemFields`.
6. Add the withholding-tax output contract and response mapper first because
   `taxBrackets` proves the array shape.
7. Add withholding-tax output tests.
8. Add the five remaining output contracts and response mappers one calculator
   at a time.
9. Update service calculation methods to return mapped outputs, preserving
   `undefined` when generated `data` is absent.
10. Update public exports.
11. Apply the three mechanical domain fixes needed by the client
   `fields` -> `inputFields` rename.
12. Update docs from "planned" to "implemented".

Do not leave a final state with temporary empty `outputFields`, and do not let
one cross a commit boundary.
`libs/api/domains/tax-calculators/src/lib/tax-calculators.service.spec.ts:19`
constructs a real `CalculatorsClientService` and runs `assertPublishableContract`
against the real registry contracts, so an empty `outputFields` is visible to the
domain suite as soon as it is committed - and goes red across all six calculators
if Section 8 later adds an output emptiness invariant.

No output-side invariant is added to `assertPublishableContract` in this round;
that is domain Section 8 work.

## Test Plan

- Update existing contract tests to read `inputFields` instead of `fields`.
- Add a service test asserting `getCalculator('withholdingTax').outputFields`
  sorts scalar and array fields by `name`.
- Add a focused test that `taxBrackets.itemFields` are sorted by `name`.
- Add output contract fixture checks by field `name`, not by array position.
- Add response mapper tests per calculator:
  - exact emitted key set for representative non-null data
  - `null` scalar source values become `undefined`
  - `undefined` scalar source values remain `undefined`
  - array source values map to arrays
  - `null`/`undefined` array source values map to `[]`
  - withholding-tax `bigint` bracket fields convert to numbers
  - guarded number conversion never emits `NaN` for missing bracket fields
- Keep mapper tests explicit enough that a dropped optional response field fails.

## Verification

Run when practical:

```bash
yarn nx run clients-rsk-calculators:test
npx eslint libs/clients/rsk/calculators/src --ext .ts --max-warnings 0
npx tsc -p libs/clients/rsk/calculators/tsconfig.lib.json --noEmit
```

If typecheck reports unrelated monorepo errors, filter for
`libs/clients/rsk/calculators/src/lib` and document the baseline before
proceeding.

Use `rg` before finishing:

```bash
rg -n "\bfields\b" libs/clients/rsk/calculators/src libs/api/domains/tax-calculators/src
rg -n "Get.*Response" libs/clients/rsk/calculators/src/index.ts
```

Expected final state:

- no raw generated `Get*Response` types exported from `src/index.ts`
- no active client code reads `CalculatorContract.fields`
- every calculator has non-empty `outputFields`
- every calculation method returns a curated output type or `undefined`

## Non-Goals

- No GraphQL/domain output or calculation implementation.
- No Contentful `configJson` schema.
- No frontend renderer.
- No labels, descriptions, assumptions copy, result groups, or layout ordering.
- No runtime output-contract validation in the client.
- No generic `calculate(key, input)` method.
- No public/domain calculator identities in the client.
