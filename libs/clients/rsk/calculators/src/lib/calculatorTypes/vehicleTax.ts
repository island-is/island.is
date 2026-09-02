import { z } from 'zod'

import type { GetVehicleTaxData } from '../../../gen/fetch'

export type VehicleTaxPeriod = 'firstHalf' | 'secondHalf'

const RSK_VALUE_BY_VEHICLE_TAX_PERIOD: Record<VehicleTaxPeriod, boolean> = {
  firstHalf: false,
  secondHalf: true,
}

export const vehicleTaxInputSchema = z.object({
  year: z.number(),
  licensePlate: z.string(),
  period: z.enum(['firstHalf', 'secondHalf']),
  periodSplitDate: z.date().optional(),
})

export type VehicleTaxInput = z.infer<typeof vehicleTaxInputSchema>

export type VehicleTaxKey = keyof VehicleTaxInput

export const toVehicleTaxQuery = (
  input: VehicleTaxInput,
): GetVehicleTaxData['query'] => ({
  ar: input.year,
  bilnumer: input.licensePlate,
  gjaldtimabil: RSK_VALUE_BY_VEHICLE_TAX_PERIOD[input.period],
  gjaldskipting: input.periodSplitDate,
})
