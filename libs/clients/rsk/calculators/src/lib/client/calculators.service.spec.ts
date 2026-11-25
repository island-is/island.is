import { CalculatorsClientService } from './calculators.service'

jest.mock('./calculators.registry', () => {
  const { z } = jest.requireActual<typeof import('zod')>('zod')
  const unsorted = {
    b: z.number().optional(),
    aB: z.number().optional(),
    a_b: z.number().optional(),
    a: z.number().optional(),
  }
  const shape = {
    query: unsorted,
    result: {
      ...unsorted,
      rows: z.array(z.object(unsorted)).optional(),
      group: z.object(unsorted).optional(),
    },
  }
  return {
    calculatorRegistry: {
      childBenefit: shape,
      interestBenefit: shape,
      vehicleBenefit: shape,
      vehicleDepreciation: shape,
      vehicleTax: shape,
      withholdingTax: shape,
    },
  }
})

const sorted = ['a', 'aB', 'a_b', 'b']

describe('CalculatorsClientService.getCalculator', () => {
  const service = new CalculatorsClientService()

  it('sorts input fields by name in code-unit order', () => {
    const names = service
      .getCalculator('vehicleTax')
      .inputFields.map((field) => field.name)

    expect(names).toEqual(sorted)
  })

  it('sorts output fields by name in code-unit order', () => {
    const names = service
      .getCalculator('vehicleTax')
      .outputFields.map((field) => field.name)

    expect(names).toEqual(['a', 'aB', 'a_b', 'b', 'group', 'rows'])
  })

  it('sorts array itemFields by name', () => {
    const rows = service
      .getCalculator('vehicleTax')
      .outputFields.find((field) => field.name === 'rows')

    expect(rows?.kind).toBe('array')

    const names =
      rows?.kind === 'array' ? rows.itemFields.map((field) => field.name) : []

    expect(names).toEqual(sorted)
  })

  it('derives object outputs with sorted itemFields', () => {
    const group = service
      .getCalculator('vehicleTax')
      .outputFields.find((field) => field.name === 'group')

    expect(group?.kind).toBe('object')

    const names =
      group?.kind === 'object'
        ? group.itemFields.map((field) => field.name)
        : []

    expect(names).toEqual(sorted)
  })
})
