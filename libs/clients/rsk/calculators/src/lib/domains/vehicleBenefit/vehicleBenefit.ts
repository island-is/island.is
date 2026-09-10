import type { GetVehicleBenefitData } from '../../../../gen/fetch'
import type { VehicleBenefitInput } from './contract'

export const toVehicleBenefitQuery = (
  input: VehicleBenefitInput,
): GetVehicleBenefitData['query'] => ({
  kaupar: input.purchaseYear,
  kaupverd: input.purchasePrice,
  rafbill: input.isElectric ?? false,
  starfsmadurGreidirHledslu: input.employeePaysCharging ?? false,
  starfsmadurGreidirRekstrarkostnad: input.employeePaysRunningCosts ?? false,
})
