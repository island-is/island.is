import type { VehicleBenefitInput } from './definition'
import { toVehicleBenefitQuery } from './input'

describe('toVehicleBenefitQuery', () => {
  const input: VehicleBenefitInput = {
    purchaseYear: 2024,
    purchasePrice: 6000000,
  }

  it('defaults the omitted booleans to false', () => {
    expect(toVehicleBenefitQuery(input)).toEqual({
      kaupar: 2024,
      kaupverd: 6000000,
      rafbill: false,
      starfsmadurGreidirHledslu: false,
      starfsmadurGreidirRekstrarkostnad: false,
    })
  })

  it('forwards the booleans when given', () => {
    expect(
      toVehicleBenefitQuery({
        ...input,
        isElectric: true,
        employeePaysCharging: true,
        employeePaysRunningCosts: true,
      }),
    ).toMatchObject({
      rafbill: true,
      starfsmadurGreidirHledslu: true,
      starfsmadurGreidirRekstrarkostnad: true,
    })
  })
})
