import * as z from 'zod'

export const ChangeOperatorOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type ChangeOperatorOfVehicle = z.TypeOf<
  typeof ChangeOperatorOfVehicleSchema
>
