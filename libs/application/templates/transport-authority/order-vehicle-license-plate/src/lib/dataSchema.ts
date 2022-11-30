import { z } from 'zod'

export const OrderVehicleLicensePlateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
  }),
  vehicle: z.object({
    plate: z.string(),
    type: z.string(),
  }),
  frontType: z.string(),
  rearType: z.string(),
  deliveryStationType: z.string(),
  deliveryStationCode: z.string(),
  includeRushFee: z.boolean(),
})

export type OrderVehicleLicensePlate = z.TypeOf<
  typeof OrderVehicleLicensePlateSchema
>
