import { CalculatorsClientService } from './calculators.service'
import type { CalculatorOutputField } from '../types/output-field'

const codeUnitSorted = (names: string[]) =>
  [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

describe('CalculatorsClientService.getCalculator', () => {
  const service = new CalculatorsClientService()

  it('sorts input fields by name in code-unit order', () => {
    const names = service
      .getCalculator('withholdingTax')
      .inputFields.map((field) => field.name)

    expect(names.indexOf('launGreidast')).toBeLessThan(
      names.indexOf('launamanudur'),
    )
    expect(names).toEqual(codeUnitSorted(names))
  })

  it('sorts output fields by name in code-unit order', () => {
    const names = service
      .getCalculator('withholdingTax')
      .outputFields.map((field) => field.name)

    expect(names).toContain('skattthrep')
    expect(names.indexOf('lifeyrisjodurProsenta')).toBeLessThan(
      names.indexOf('lifeyrissjodur'),
    )
    expect(names).toEqual(codeUnitSorted(names))
  })

  it('sorts array itemFields by name', () => {
    const skattthrep = service
      .getCalculator('withholdingTax')
      .outputFields.find((field) => field.name === 'skattthrep')

    expect(skattthrep?.kind).toBe('array')

    const names =
      skattthrep?.kind === 'array'
        ? skattthrep.itemFields.map((field) => field.name)
        : []

    expect(names).toEqual(codeUnitSorted(names))
    expect(names).toEqual([
      'nedriMork',
      'numerThreps',
      'reiknudStadgreidsla',
      'stadgreidsluhlutfall',
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

  it('returns the requested key', () => {
    expect(service.getCalculator('vehicleTax').key).toBe('vehicleTax')
  })
})
