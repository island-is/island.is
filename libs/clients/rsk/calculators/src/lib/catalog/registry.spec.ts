import type { CalculatorContract } from '../types/calculator'
import { calculatorRegistry } from './registry'

/* Widened from the registry's per-calculator `as const` types: mapping over a
 * union of six readonly tuple types is what TypeScript rejects. */
const contracts: CalculatorContract[] = Object.values(calculatorRegistry)

describe('calculatorRegistry', () => {
  /* Query mappers are hand-written, so a `percentage` input is forwarded to RSK
   * unconverted unless its mapper wires `percentToRskRatio`. Failing here is
   * the intended signal: add the field only once its mapper divides. */
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

  /* The mirror of the above for the return trip; add a field only once its
   * mapper wires `rskRatioToPercent`. Item fields are included because
   * `taxBrackets.withholdingRate` would otherwise be missed. */
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
