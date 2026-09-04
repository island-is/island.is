import { z } from 'zod'

import type { GetVehicleBenefitData } from '../../../gen/fetch'
import { currency, year } from './semantics'

export const vehicleBenefitInputSchema = z.object({
  purchaseYear: year(),
  purchasePrice: currency(),
  // RSK requires these, but each means "no" unless stated.
  isElectric: z.boolean().optional(),
  employeePaysCharging: z.boolean().optional(),
  employeePaysRunningCosts: z.boolean().optional(),
})

export type VehicleBenefitInput = z.infer<typeof vehicleBenefitInputSchema>

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
