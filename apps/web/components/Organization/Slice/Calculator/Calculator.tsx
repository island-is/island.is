import { Calculator as CalculatorSlice } from '@island.is/web/graphql/schema'

interface CalculatorProps {
  slice: CalculatorSlice
}

/* Renders nothing until the calculator flow is complete.
 *
 * `configJson` carries the editor-authored section structure -- ordering,
 * gating, spans and label overrides -- but not the input contract: a section
 * field is only a `key` pointing at a backend field whose kind, options,
 * bounds and required flag came from the `taxCalculatorFields` query. That
 * query has been removed (the domain module hardcoded a field list that did
 * not match RSK's own inputs), so there is currently no source for which
 * control to render. Rendering structure alone would produce empty sections,
 * so the slice stays mounted and renders nothing instead.
 *
 * The component and its three registration sites (richText.tsx,
 * SliceMachine.tsx, Organization/index.ts) are deliberately left in place so
 * the Contentful slice keeps resolving while the flow is rebuilt against
 * @island.is/clients/rsk/calculators. */
const Calculator = (_props: CalculatorProps) => null

export default Calculator
