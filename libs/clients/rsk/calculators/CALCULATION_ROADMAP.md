# RSK Calculators Client Calculation Roadmap

This roadmap documents the client layer's role in the public tax calculator
calculation flow.

The client is already the typed RSK boundary. It owns calculator-specific input
types, RSK query mappers, fetch calls, curated output contracts and response
mappers. The public GraphQL calculation operation should build on that boundary
instead of making the client generic.

## Goal

Keep calculation execution explicit per calculator while allowing the API domain
to dispatch from a generic, metadata-driven GraphQL operation.

The client continues to expose:

- `getCalculator(key)` for input/output metadata
- one typed calculation method per calculator
- per-calculator input interfaces
- per-calculator output interfaces
- per-calculator input-to-RSK query mappers
- per-calculator RSK response-to-output mappers

## Boundaries

The client owns:

- RSK endpoint choice
- RSK query parameter names
- RSK option conversion
- RSK-specific date conversion
- per-calculator TypeScript input and output shapes
- conversion from generated RSK response objects to curated output objects
- preserving generated-client absence behavior: no `data` means `undefined`

The client does not own:

- public `TaxCalculatorType`
- GraphQL operation shape
- keyed GraphQL input rows
- CMS output layout
- public labels or markdown
- generic dispatch by public calculator type
- web form serialization

## Calculation Methods

Calculation methods stay explicit:

- `getChildBenefit(input)`
- `getVehicleTax(input)`
- `getVehicleBenefit(input)`
- `getWithholdingTax(input?)`

`vehicleDepreciation` and `interestBenefit` remain client-supported but not
publicly reachable until `TaxCalculatorType` grows.

Do not add a generic `calculate(key, input)` method unless a later design records
a concrete reason. The API domain is the generic public boundary; the client is
the typed RSK boundary.

## Input Handling

The client accepts calculator-specific typed inputs. It should not accept the
GraphQL keyed-row input shape directly.

The API domain validates and coerces public keyed rows into the typed input
object for the selected client method. Once the client receives that object, its
existing mapper translates it to RSK query parameters.

Settled public-boundary input conventions:

- select values arrive as stable client option values
- date values arrive as `yyyy-MM-dd` strings
- percentage number inputs arrive as whole-percent values
- month number inputs arrive as `1-12`, accepted as the current baseline and
  still unverified against RSK

The client mapper owns any RSK-specific conversion after that point.

### Percentage inputs divide by 100 here

RSK's own spec documents these parameters as `gefið sem tala milli 0 og 1`. The
public boundary carries whole percent, so the query mapper is where the two
meet: it divides by 100.

Two input fields carry `semantic: 'percentage'` across all six calculators,
both on `withholdingTax`:

- `taxCardUtilization` -> `nytingSkattkorts`
- `spouseTaxCardUtilization` -> `nytingSkattkortsMaka`

This keeps one rule for percentages inside `toWithholdingTaxQuery`, which
already converts the select-based ratios (`'4%' -> 0.04`) in the same function.
Placing the conversion anywhere else would leave two kinds of percentage in one
mapper behaving differently.

Percentage *outputs* are unaffected and stay client-owned at whatever scale RSK
returns, as below.

## Output Handling

Client calculation methods return curated output objects, not generated RSK
responses. Keys on these objects match `getCalculator(key).outputFields[].name`.

Mapped outputs expose no `null`:

- scalar fields are optional and use `undefined` for missing RSK values
- array fields are always arrays and fall back to `[]`

The API domain maps these typed output objects into GraphQL keyed output rows.
The client should not know about that transport shape.

Output percentage scale stays client-owned. The domain should not reinterpret
percentage outputs. If a future investigation verifies that an RSK output field
needs normalization, that conversion belongs in the client response mapper.

## Verification

Changes in this layer should keep the existing guarantees covered:

- per-calculator query mapper tests
- percentage inputs divided by 100, including `0` and a fractional percent
- per-calculator response mapper tests
- service tests for typed method behavior
- no import of `TaxCalculatorType`
- no exported generated `Get*Response` types
