import { YES } from '@island.is/application/core'
import { z } from 'zod'

export const AnonymityInVehicleRegistrySchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  isChecked: z.array(z.enum([YES])).optional(),
})

export type AnonymityInVehicleRegistry = z.TypeOf<
  typeof AnonymityInVehicleRegistrySchema
>
