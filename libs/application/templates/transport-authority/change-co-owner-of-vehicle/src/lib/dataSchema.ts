import { z } from 'zod'

export const ChangeCoOwnerOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicle: z.object({
    plate: z.string(),
  }),
  owner: z.object({
    nationalId: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  coOwners: z.array(
    z.object({
      nationalId: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      approved: z.boolean().optional(),
      wasAdded: z.boolean(),
      wasRemoved: z.boolean(),
    }),
  ),
})

export type ChangeCoOwnerOfVehicle = z.TypeOf<
  typeof ChangeCoOwnerOfVehicleSchema
>
