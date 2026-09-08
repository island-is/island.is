import { CalculatorsClientService } from './calculators.service'

describe('CalculatorsClientService.getCalculator', () => {
  const service = new CalculatorsClientService()

  it('sorts fields by name in code-unit order', () => {
    const names = service.getCalculator('withholdingTax').fields.map(
      (field) => field.name,
    )

    expect(names.indexOf('payMonth')).toBeLessThan(
      names.indexOf('paymentFrequency'),
    )
    expect(names).toEqual([...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)))
  })

  it('does not mutate the authored contract', () => {
    const first = service.getCalculator('childBenefit').fields.map((f) => f.name)
    const second = service
      .getCalculator('childBenefit')
      .fields.map((f) => f.name)

    expect(first).toEqual(second)
  })

  it('returns the requested key', () => {
    expect(service.getCalculator('vehicleTax').key).toBe('vehicleTax')
  })
})
