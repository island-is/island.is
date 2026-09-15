import { CalculatorsClientService } from './calculators.service'
import type { CalculatorOutputField } from './contracts/output'

const codeUnitSorted = (names: string[]) =>
  [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

describe('CalculatorsClientService.getCalculator', () => {
  const service = new CalculatorsClientService()

  it('sorts input fields by name in code-unit order', () => {
    const names = service
      .getCalculator('withholdingTax')
      .inputFields.map((field) => field.name)

    expect(names.indexOf('payMonth')).toBeLessThan(
      names.indexOf('paymentFrequency'),
    )
    expect(names).toEqual(codeUnitSorted(names))
  })

  it('sorts output fields by name in code-unit order', () => {
    const names = service
      .getCalculator('withholdingTax')
      .outputFields.map((field) => field.name)

    expect(names).toContain('taxBrackets')
    expect(names.indexOf('payMonth')).toBeLessThan(names.indexOf('payrollTax'))
    expect(names).toEqual(codeUnitSorted(names))
  })

  it('sorts array itemFields by name', () => {
    const taxBrackets = service
      .getCalculator('withholdingTax')
      .outputFields.find((field) => field.name === 'taxBrackets')

    expect(taxBrackets?.kind).toBe('array')

    const names =
      taxBrackets?.kind === 'array'
        ? taxBrackets.itemFields.map((field) => field.name)
        : []

    expect(names).toEqual(codeUnitSorted(names))
    expect(names).toEqual([
      'bracketNumber',
      'calculatedWithholding',
      'lowerBound',
      'withholdingRate',
    ])
  })

  it('does not mutate the authored contract', () => {
    const names = (contract: {
      inputFields: readonly { name: string }[]
      outputFields: readonly CalculatorOutputField[]
    }) => [
      contract.inputFields.map((field) => field.name),
      contract.outputFields.map((field) => field.name),
    ]

    expect(names(service.getCalculator('childBenefit'))).toEqual(
      names(service.getCalculator('childBenefit')),
    )
  })

  it('publishes output fields for every calculator', () => {
    for (const key of [
      'childBenefit',
      'interestBenefit',
      'vehicleBenefit',
      'vehicleDepreciation',
      'vehicleTax',
      'withholdingTax',
    ] as const) {
      expect(service.getCalculator(key).outputFields.length).toBeGreaterThan(0)
    }
  })

  it('returns the requested key', () => {
    expect(service.getCalculator('vehicleTax').key).toBe('vehicleTax')
  })
})
