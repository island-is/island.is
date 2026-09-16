import type { CalculatorContract } from './field'
import { calculatorRegistry } from './registry'

/* Widened from the registry's per-calculator `as const` types: mapping over the
 * union of six distinct readonly tuple types is what TypeScript rejects with
 * "none of those signatures are compatible with each other". */
const contracts: CalculatorContract[] = Object.values(calculatorRegistry)

describe('calculatorRegistry', () => {
  /* Query mappers are hand-written per calculator, so a `percentage` input
   * added to any contract is silently forwarded to RSK unconverted unless its
   * mapper wires `percentToRskRatio` -- the exact bug this assertion exists to
   * catch. Failing here is the intended signal, not a chore: add the field to
   * the list only once its mapper divides.
   *
   * The set is asserted whole rather than per calculator, so a seventh
   * percentage input added inside `withholdingTax` fails too. Sorted because
   * `Object.values` walks declaration order, and `toEqual` on an array is
   * order-sensitive. */
  it('carries percentage inputs only where the mapper converts them', () => {
    const percentageInputs = contracts
      .flatMap((contract) =>
        contract.inputFields.map((field) => ({ contract, field })),
      )
      .filter(({ field }) => field.semantic === 'percentage')
      .map(({ contract, field }) => `${contract.key}.${field.name}`)
      .sort()

    expect(percentageInputs).toEqual([
      'withholdingTax.spouseTaxCardUtilization',
      'withholdingTax.taxCardUtilization',
    ])
  })
})
