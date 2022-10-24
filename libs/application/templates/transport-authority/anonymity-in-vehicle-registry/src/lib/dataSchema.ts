import * as z from 'zod'

export const AnonymityInVehicleRegistrySchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type AnonymityInVehicleRegistry = z.TypeOf<
  typeof AnonymityInVehicleRegistrySchema
>
