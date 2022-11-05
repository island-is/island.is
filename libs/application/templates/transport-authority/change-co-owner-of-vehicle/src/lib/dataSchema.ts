import { z } from 'zod'

export const ChangeCoOwnerOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicle: z.object({
    plate: z.string(),
  }),
  owner: z.object({
    email: z.string(),
  }),
  coOwners: z.array(
    z.object({
      nationalId: z.string(),
      email: z.string(),
    }),
  ),
})

export type ChangeCoOwnerOfVehicle = z.TypeOf<
  typeof ChangeCoOwnerOfVehicleSchema
>
