import type { SubmittedValues } from '../../submission/submission'
import { toVehicleBenefitInput } from './vehicleBenefit'

const values: SubmittedValues = {
  kaupar: 2024,
  kaupverd: 6000000,
  rafbill: true,
  starfsmadurGreidirHledslu: false,
  starfsmadurGreidirRekstrarkostnad: false,
}

describe('client input builders', () => {
  it('builds a vehicle benefit input', () => {
    expect(toVehicleBenefitInput(values)).toEqual(values)
  })

  it('throws when a required boolean is absent', () => {
    const { rafbill: _rafbill, ...withoutElectric } = values

    expect(() => toVehicleBenefitInput(withoutElectric)).toThrow(
      /missing required field "rafbill"/,
    )
  })
})
