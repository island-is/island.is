import * as z from 'zod'

export const ChangeCoOwnerOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type ChangeCoOwnerOfVehicle = z.TypeOf<
  typeof ChangeCoOwnerOfVehicleSchema
>
