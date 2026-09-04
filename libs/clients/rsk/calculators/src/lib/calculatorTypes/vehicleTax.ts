import { z } from 'zod'

import type { GetVehicleTaxData } from '../../../gen/fetch'
import {
  RSK_VALUE_BY_VEHICLE_TAX_PERIOD,
  VEHICLE_TAX_PERIODS,
} from './constants'
import { year } from './semantics'

export const vehicleTaxInputSchema = z.object({
  year: year(),
  licensePlate: z.string(),
  period: z.enum(VEHICLE_TAX_PERIODS),
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
