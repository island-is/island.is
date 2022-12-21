import { z } from 'zod'
import { YES } from '@island.is/application/core'

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
  plateReason: z.object({
    reason: z.enum(['new', 'lost']),
  }),
  plateSize: z.object({
    frontPlateSize: z.enum(['sizeA', 'sizeB']),
    rearPlateSize: z.enum(['sizeA', 'sizeB']),
  }),
  plateDelivery: z.object({
    deliveryType: z.enum(['transportAuthority', 'deliveryStation']),
    deliveryStationCode: z.string().optional(),
    includeRushFee: z.array(z.enum([YES])).optional(),
  }),
})

export type OrderVehicleLicensePlate = z.TypeOf<
  typeof OrderVehicleLicensePlateSchema
>
