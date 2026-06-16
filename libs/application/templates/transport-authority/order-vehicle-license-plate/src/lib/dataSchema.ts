import { z } from 'zod'
import { YES, NO } from '@island.is/application/core'

export const OrderVehicleLicensePlateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    plate: z.string().min(1),
    vehicle: z.string().optional(),
    color: z.string().optional(),
    type: z.string().optional(),
  }),
  plateType: z.object({
    regGroup: z.string().min(1),
    currentPlateTypeName: z.string().optional(),
    selectedPlateTypeName: z.string().optional(),
  }),
  plateSize: z
    .object({
      frontPlateSize: z.array(z.string()).max(1),
      rearPlateSize: z.array(z.string()).max(1),
      frontPlateSizeName: z.string().optional(),
      rearPlateSizeName: z.string().optional(),
      currentFrontSize: z.string().optional(),
      currentRearSize: z.string().optional(),
    })
    .refine(({ frontPlateSize, rearPlateSize }) => {
      return frontPlateSize.length !== 0 || rearPlateSize.length !== 0
    }),
  plateDelivery: z.object({
    deliveryMethodIsDeliveryStation: z.enum([YES, NO]),
    deliveryStationTypeCode: z.string().optional(),
    includeRushFee: z.array(z.enum([YES])).optional(),
  }),
})

export type OrderVehicleLicensePlate = z.TypeOf<
  typeof OrderVehicleLicensePlateSchema
>
