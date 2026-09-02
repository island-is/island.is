import type { GetVehicleBenefitData } from '../../../gen/fetch'

export interface VehicleBenefitInput {
  purchaseYear: number
  purchasePrice: number
  // RSK requires these, but each means "no" unless stated.
  isElectric?: boolean
  employeePaysCharging?: boolean
  employeePaysRunningCosts?: boolean
}

export type VehicleBenefitKey = keyof VehicleBenefitInput

export const toVehicleBenefitQuery = (
  input: VehicleBenefitInput,
): GetVehicleBenefitData['query'] => ({
  kaupar: input.purchaseYear,
  kaupverd: input.purchasePrice,
  rafbill: input.isElectric ?? false,
  starfsmadurGreidirHledslu: input.employeePaysCharging ?? false,
  starfsmadurGreidirRekstrarkostnad: input.employeePaysRunningCosts ?? false,
})
