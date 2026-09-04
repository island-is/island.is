import { Calculator as CalculatorSlice } from '@island.is/web/graphql/schema'

interface CalculatorProps {
  slice: CalculatorSlice
}

/* Renders nothing until the calculator form renderer is built.
 *
 * Both halves of the contract now exist: `taxCalculatorFields` returns the
 * input contract per calculator (key, dataType, required, options, dependsOn)
 * from @island.is/clients/rsk/calculators, and `configJson` carries the
 * editor-authored section structure -- ordering, gating, spans and the
 * bilingual labels -- joined to the backend fields by `key`. What is missing
 * is the renderer that walks the sections, picks a control per `dataType`,
 * resolves section toggles/gates, and honours `dependsOn`.
 *
 * Two gaps that renderer has to close: enum options arrive as raw identifiers
 * (`firstHalf`, `secondHalf`) and `configJson` has nowhere to author their
 * display text yet; and a required field the editor never placed in a section
 * simply will not render, so unplaced required fields need flagging.
 *
 * The component and its three registration sites (richText.tsx,
 * SliceMachine.tsx, Organization/index.ts) are deliberately left in place so
 * the Contentful slice keeps resolving in the meantime. */
const Calculator = (_props: CalculatorProps) => null

export default Calculator
