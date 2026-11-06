import type { VehicleDepreciationInput } from './definition'
import { toVehicleDepreciationQuery } from './input'

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
