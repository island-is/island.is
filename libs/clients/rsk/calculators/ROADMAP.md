# RSK Calculators Client Rebuild Roadmap

This roadmap is the implementation control document for the client rebuild.

Before starting a section, read `DESIGN.md` and restate the goal checkpoint from
that document. After finishing a section, review the work against `DESIGN.md`
before moving to the next section.

Each section must leave the codebase in a verifiable state.

## Section 1: Shared Contract Primitives

Goal: add the shared v1 contract types used by every calculator.

Work:

- create `src/lib/contracts/field.ts`
- create `src/lib/utils/toRskValue.ts` if shared option-to-RSK conversion stays
  useful across calculators
- define `CalculatorContract`
- define `CalculatorField`
- define `CalculatorFieldType`
- define `CalculatorFieldSemantic`
- define `CalculatorFieldOption`
- define `CalculatorFieldDependency`

Design checks:

- `CalculatorContract` is generic and does not import the registry
- the contract is plain typed data
- no Zod is used to validate or construct the custom input contract
- dependencies support simple equality only
- `type: 'date'` is represented by an explicit `yyyy-MM-dd` string input value
- number semantics are limited to `currency`, `percentage`, `year`, `month`,
  and `count`

Verification:

- typecheck the client library if practical
- confirm `field.ts` imports no calculator modules
- log any contract-shape decision in the Obsidian decision log

## Section 2: Registry And Service Contract Lookup

Goal: create the client-local calculator registry and expose contract lookup
through the Nest service.

Work:

- create `src/lib/contracts/registry.ts`
- derive `CalculatorKey` from the registry
- add `getCalculator(key)` to `CalculatorsClientService`
- return fields sorted by `name` using code-unit comparison
- keep calculation methods explicit per calculator

Design checks:

- registry keys are client-local RSK calculator identities
- the client does not import `TaxCalculatorType`
- `getCalculator` returns the downstream machine-readable contract
- no generic `calculate(key, input)` method is introduced
- `getWithholdingTax` keeps its optional input argument
- visual ordering remains downstream-owned

Verification:

- add or update focused tests for `getCalculator`
- confirm the returned field list is sorted by `name` with a code-unit
  comparator, using `withholdingTax` so `payMonth` and `paymentFrequency`
  distinguish the comparator from locale-aware sorting
- confirm unknown public calculator identity handling remains outside the client
- log registry/service-boundary decisions in the Obsidian decision log

## Section 3: First Calculator Slice

Goal: implement one calculator end to end using the new pattern before expanding
the migration.

Use `childBenefit` unless there is a concrete reason to choose another
calculator first.

Non-goals:

- do not correct existing requiredness issues in this section
- do not change percentage conversion behavior in this section

Work:

- create `src/lib/domains/childBenefit/schema.ts`
- create `src/lib/domains/childBenefit/childBenefit.ts`
- create `src/lib/domains/childBenefit/index.ts`
- author the contract as plain data
- define `ChildBenefitInput` explicitly
- implement the outbound mapper to RSK query parameters
- preserve the boolean dependency shape for split custody fields

Design checks:

- `schema.ts` is plain contract data, not a validation schema
- field identity is by `name`
- option labels/translations are not authored in the client
- RSK-side number semantics are encoded in the contract when they affect field
  shape
- date fields use string input values and convert to RSK `Date` values in the
  mapper when needed
- input types stay explicit and local to each calculator schema

Verification:

- add a fixture test for the child benefit contract
- verify contract fields by `name`, not by array position
- add a mapper test for the child benefit RSK query conversion
- review the slice against `DESIGN.md` before adding another calculator
- log field and mapper interpretation decisions in the Obsidian decision log

## Section 4: Remaining Calculator Slices

Goal: migrate the remaining calculators using the proven per-calculator pattern.

Work through calculators one at a time:

- `vehicleTax`
- `vehicleBenefit`
- `vehicleDepreciation`
- `withholdingTax`
- `interestBenefit`

For each calculator:

- create or update `schema.ts`
- create or update `<calculator>.ts`
- create or update `index.ts`
- author the contract as plain data
- define the input type explicitly
- implement the outbound mapper
- add contract and mapper tests

Non-goals:

- do not correct existing requiredness issues during this section
- do not change percentage conversion behavior during this section

Design checks:

- do not introduce calculator-specific behavior into shared contract primitives
- do not extend the contract shape unless the current calculator cannot be
  represented with v1
- keep RSK interpretation in the client
- keep date string-to-`Date` conversion inside the per-calculator mapper when
  generated RSK query types require it
- keep GraphQL, CMS, frontend, labels, and layout semantics out of the client

Verification:

- run the focused client test suite after each calculator when practical
- verify per-calculator contract fixtures by `name`, not by array position
- compare each calculator contract against RSK docs/API interpretation
- log field, option, requiredness, dependency, and mapper decisions in the
  Obsidian decision log

## Section 5: Remove Archived/Old Contract Path From Active Exports

Goal: make the new contract path the only active client contract path.

Work:

- update client exports from `src/index.ts`
- remove active imports from the old contract path
- keep archived files out of active imports
- remove obsolete utilities only when nothing active imports them

Design checks:

- no active exported API depends on schema introspection
- no Zod-built calculator input contract remains in the active client path
- public/domain identities remain outside the client

Verification:

- use `rg` to confirm no active imports reference the old contract machinery
- run focused tests/typecheck when practical
- log removals and export-boundary decisions in the Obsidian decision log

## Section 6: GraphQL Domain Mediation

Goal: update `libs/api/domains/tax-calculators` to consume the new client
contract through the client service.

Sections 1-5 and this section should land in the same PR. Sections 1-5 alone
leave `apps/api` red because the GraphQL domain still consumes the old client
contract.

Work:

- inject the RSK calculators client module/service
- call `getCalculator(key)` for metadata
- keep the mapping from `TaxCalculatorType` to client-local `CalculatorKey` in
  the GraphQL domain
- map the client contract to GraphQL models/enums
- keep downstream publication semantics in the domain

Design checks:

- the RSK client still does not import `TaxCalculatorType`
- the domain mediates between public calculator identity and client-local keys
- domain docs/comments do not explain client internals
- CMS/frontend-facing semantics stay outside the client

Verification:

- add or update domain mapping fixture tests
- verify public GraphQL field shape remains intentional
- log boundary and mapping decisions in the Obsidian decision log

## Section 7: Final Review

Goal: verify the rebuild as a whole against the design.

Checks:

- every calculator has a plain authored contract
- every calculator has an explicit outbound mapper
- `getCalculator(key)` returns contract fields sorted by `name` using code-unit
  comparison
- calculation methods remain explicit
- client-local keys are derived from the registry
- `TaxCalculatorType` is not imported by the RSK client
- GraphQL domain owns public calculator identity mediation
- no active custom input contract is validated or constructed with Zod
- contract changes are covered by intentional tests
- meaningful decisions were logged in Obsidian

Verification:

- run the focused client tests
- run the focused tax-calculators domain tests
- run typecheck targets if practical
- perform a final review against `DESIGN.md`
