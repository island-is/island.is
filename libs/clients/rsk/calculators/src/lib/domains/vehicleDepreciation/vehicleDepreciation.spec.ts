import type { CalculatorField } from '../../contracts/field'
import type { VehicleDepreciationInput } from './schema'
import { vehicleDepreciationCalculator } from './schema'
import { toVehicleDepreciationQuery } from './vehicleDepreciation'

const fieldsByName: Record<string, CalculatorField> = Object.fromEntries(
  vehicleDepreciationCalculator.fields.map((field) => [field.name, field]),
)

describe('vehicleDepreciation contract', () => {
  it('declares each field as authored', () => {
    expect(Object.keys(fieldsByName).sort()).toEqual([
      'arrivalMonth',
      'arrivalYear',
      'price',
      'purchaseMonth',
      'purchaseYear',
    ])
    expect(fieldsByName).toMatchObject({
      price: { type: 'number', required: true, semantic: 'currency' },
      purchaseMonth: { type: 'number', required: true, semantic: 'month' },
      purchaseYear: { type: 'number', required: true, semantic: 'year' },
      arrivalMonth: { type: 'number', required: true, semantic: 'month' },
      arrivalYear: { type: 'number', required: true, semantic: 'year' },
    })
  })
})

describe('toVehicleDepreciationQuery', () => {
  it('emits every RSK parameter and nothing else', () => {
    const input: VehicleDepreciationInput = {
      price: 4500000,
      purchaseMonth: 3,
      purchaseYear: 2023,
      arrivalMonth: 5,
      arrivalYear: 2023,
    }

    expect(toVehicleDepreciationQuery(input)).toEqual({
      verd: 4500000,
      kaupmanudur: 3,
      kaupar: 2023,
      komumanudur: 5,
      komuar: 2023,
    })
  })
})
