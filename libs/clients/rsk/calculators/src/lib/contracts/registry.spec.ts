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

  /* The mirror of the assertion above, for the return trip: an output declared
   * `percentage` that its mapper forwards unconverted publishes RSK's 0-1 ratio
   * where the contract promises a whole 0-100 figure. Add a field here only
   * once its output mapper wires `rskRatioToPercent`.
   *
   * Array item fields are included, since `taxBrackets.withholdingRate` is a
   * percentage that the scalar walk alone would miss. */
  it('carries percentage outputs only where the mapper converts them', () => {
    const percentageOutputs = contracts
      .flatMap((contract) =>
        contract.outputFields.flatMap((field) =>
          field.kind === 'array'
            ? field.itemFields.map((itemField) => ({
                contract,
                field: itemField,
                path: `${field.name}.${itemField.name}`,
              }))
            : [{ contract, field, path: field.name }],
        ),
      )
      .filter(({ field }) => field.semantic === 'percentage')
      .map(({ contract, path }) => `${contract.key}.${path}`)
      .sort()

    expect(percentageOutputs).toEqual([
      'childBenefit.excessReductionRate',
      'childBenefit.reductionRate',
      'childBenefit.reductionRateForChildrenUnder7',
      'interestBenefit.assetReductionRate',
      'interestBenefit.debtReductionRate',
      'interestBenefit.incomeReductionRate',
      'withholdingTax.appliedPensionFundRatio',
      'withholdingTax.appliedPrivatePensionRatio',
      'withholdingTax.taxBrackets.withholdingRate',
      'withholdingTax.withholdingRate',
    ])
  })
})
