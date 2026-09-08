import type { CalculatorField } from '../../contracts/field'
import type { VehicleTaxInput } from './schema'
import { vehicleTaxCalculator } from './schema'
import { toVehicleTaxQuery } from './vehicleTax'

const fieldsByName: Record<string, CalculatorField> = Object.fromEntries(
  vehicleTaxCalculator.fields.map((field) => [field.name, field]),
)

describe('vehicleTax contract', () => {
  it('declares each field as authored', () => {
    expect(Object.keys(fieldsByName).sort()).toEqual([
      'licensePlate',
      'period',
      'periodSplitDate',
      'year',
    ])
    expect(fieldsByName).toMatchObject({
      year: { type: 'number', required: true, semantic: 'year' },
      licensePlate: { type: 'string', required: true },
      period: {
        type: 'select',
        required: true,
        options: [{ value: 'firstHalf' }, { value: 'secondHalf' }],
      },
      periodSplitDate: { type: 'date', required: false },
    })
  })

  it('carries no semantic on the date field', () => {
    expect(fieldsByName['periodSplitDate'].semantic).toBeUndefined()
  })
})

describe('toVehicleTaxQuery', () => {
  const input: VehicleTaxInput = {
    year: 2025,
    licensePlate: 'AB123',
    period: 'firstHalf',
  }

  it('emits every RSK parameter and nothing else', () => {
    expect(toVehicleTaxQuery(input)).toStrictEqual({
      ar: 2025,
      bilnumer: 'AB123',
      gjaldtimabil: false,
      gjaldskipting: undefined,
    })
  })

  it('maps the period to the boolean RSK expects', () => {
    expect(toVehicleTaxQuery({ ...input, period: 'secondHalf' }).gjaldtimabil).
      toBe(true)
  })

  it('converts the date string to a UTC-midnight Date', () => {
    const query = toVehicleTaxQuery({ ...input, periodSplitDate: '2025-07-01' })

    expect(query.gjaldskipting).toEqual(new Date('2025-07-01T00:00:00.000Z'))
  })
})
