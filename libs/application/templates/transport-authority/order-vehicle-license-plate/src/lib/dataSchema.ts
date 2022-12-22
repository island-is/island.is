import { z } from 'zod'
import { YES, NO } from '@island.is/application/core'

export const OrderVehicleLicensePlateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
    plateTypeFront: z.string().optional(),
    plateTypeRear: z.string().optional(),
  }),
  vehicle: z.object({
    plate: z.string(),
    type: z.string(),
  }),
  plateReason: z.object({
    reason: z.enum(['new', 'lost']),
  }),
  plateSize: z.object({
    frontPlateSize: z.string(),
    rearPlateSize: z.string(),
  }),
  plateDelivery: z.object({
    deliveryMethodIsDeliveryStation: z.enum([YES, NO]),
    deliveryStationCodeType: z.string().optional(),
    includeRushFee: z.array(z.enum([YES])).optional(),
  }),
})

export type OrderVehicleLicensePlate = z.TypeOf<
  typeof OrderVehicleLicensePlateSchema
>
