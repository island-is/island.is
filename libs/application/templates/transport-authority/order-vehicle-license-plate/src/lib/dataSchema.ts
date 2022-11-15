import { z } from 'zod'

export const OrderVehicleLicensePlateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  includeRushFee: z.boolean(),
})

export type OrderVehicleLicensePlate = z.TypeOf<
  typeof OrderVehicleLicensePlateSchema
>
