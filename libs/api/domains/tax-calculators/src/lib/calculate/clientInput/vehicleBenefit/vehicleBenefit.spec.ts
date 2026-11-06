import { toVehicleBenefitInput } from './vehicleBenefit'

describe('client input builders', () => {
  it('builds a vehicle benefit input', () => {
    expect(
      toVehicleBenefitInput({
        purchaseYear: 2024,
        purchasePrice: 6000000,
        isElectric: true,
      }),
    ).toMatchObject({
      purchaseYear: 2024,
      purchasePrice: 6000000,
      isElectric: true,
      employeePaysCharging: undefined,
    })
  })
})
