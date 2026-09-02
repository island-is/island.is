import { z } from 'zod'

import type { GetVehicleDepreciationData } from '../../../gen/fetch'

export const vehicleDepreciationInputSchema = z.object({
  price: z.number(),
  purchaseMonth: z.number(),
  purchaseYear: z.number(),
  arrivalMonth: z.number(),
  arrivalYear: z.number(),
})

export type VehicleDepreciationInput = z.infer<
  typeof vehicleDepreciationInputSchema
>

export type VehicleDepreciationKey = keyof VehicleDepreciationInput

export const toVehicleDepreciationQuery = (
  input: VehicleDepreciationInput,
): GetVehicleDepreciationData['query'] => ({
  verd: input.price,
  kaupmanudur: input.purchaseMonth,
  kaupar: input.purchaseYear,
  komumanudur: input.arrivalMonth,
  komuar: input.arrivalYear,
})
