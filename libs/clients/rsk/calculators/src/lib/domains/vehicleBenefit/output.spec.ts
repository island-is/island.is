import type { VehicleBenefitResult } from '../../../../gen/fetch'
import { toVehicleBenefitOutput } from './output'

const result: VehicleBenefitResult = {
  kaupar: 1,
  kaupverd: 2,
  arshlunnindi: 3,
  manadarhlunnindi: 4,
}

describe('toVehicleBenefitOutput', () => {
  it('reads each output field from its own RSK source key', () => {
    expect(toVehicleBenefitOutput(result)).toEqual({
      purchaseYear: 1,
      purchasePrice: 2,
      annualBenefit: 3,
      monthlyBenefit: 4,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    const empty: VehicleBenefitResult = {}
    const output = toVehicleBenefitOutput(empty)

    expect(output.purchaseYear).toBeUndefined()
    expect(output.purchasePrice).toBeUndefined()
    expect(output.annualBenefit).toBeUndefined()
    expect(output.monthlyBenefit).toBeUndefined()
  })
})
