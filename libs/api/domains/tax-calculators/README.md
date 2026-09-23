# api-domains-tax-calculators

## Intent

This domain is the public, contract-driven boundary for Skatturinn (RSK) tax
calculators. It lets a consumer discover a calculator's fields, submit typed
values, and receive typed results without baking an RSK calculator definition
into each consumer.

It exposes `taxCalculator(type:)` for the field contract and
`taxCalculatorCalculate(input:)` for calculations.

## Design decisions

### The RSK client owns calculator definitions

Field definitions and RSK-specific conversions come from
`@island.is/clients/rsk/calculators`; this domain must not repeat them. It owns
the public GraphQL contract, the mapping from `TaxCalculatorType` to
`CalculatorKey`, and the validation needed to safely publish and use the client
contract.

The client currently has more calculators than the public
`TaxCalculatorType` enum. Only types present in that enum are reachable here.

### Contracts are trusted only after validation

Before publishing or calculating, the domain validates the client contract:
field names and options must be unique, dependencies must be compatible and
non-chained, and input and output field shapes must be valid. A broken contract
throws because it is a code defect that must be fixed before deployment, not a
recoverable user error.

### The API is generic; the RSK call is specific

The GraphQL API carries values keyed by field key. After submission validation,
the domain converts that generic record to the input type required by the
selected RSK calculator. This keeps the consumer API stable while retaining
compile-time checks for every calculator-specific RSK call.

### Submission errors are returned, not thrown

Input validation checks unknown and duplicate fields, requiredness,
applicability, type, permitted options, dates, and semantic ranges. These are
expected user-facing failures, so calculation is skipped and structured errors
are returned. The defensive conversion helpers throw only if an invariant that
validation established is later broken.

### Results are constrained by the published contract

RSK results are mapped through the output contract. The domain returns only
declared fields with values matching their declared type. This protects
consumers from accidental upstream additions or malformed values while keeping
the result keyed by the same stable contract vocabulary.

### Content and calculation metadata are separate

The contract supplies machine-readable field behavior. Contentful supplies the
editor-authored presentation around it, joined by field `key`. This separation
lets one calculator contract be rendered in different placements without
duplicating calculator rules.

## Public conventions

- Percentages are whole percentages: `37`, not `0.37`.
- Dates use `yyyy-MM-dd`.
- `percentage`, `month`, and `count` bounds are declared once in
  `shared/numericSemanticRange.ts` and used for both metadata and validation.
- An invalid input or failed calculation returns `errors` and no calculation.
  A broken calculator contract throws.

## Structure

- `contract/` maps and validates calculator contracts.
- `calculate/submission/` validates submitted values.
- `calculate/clientInput/` builds calculator-specific RSK inputs.
- `calculate/outputFieldValue/` maps RSK results to public values.
- `models/inputField/` and `models/outputField/` contain one GraphQL model per
  file; their `index.ts` files only re-export models.

## Tests

```bash
nx test api-domains-tax-calculators
```
