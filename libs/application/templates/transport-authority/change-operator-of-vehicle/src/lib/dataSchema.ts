import { z } from 'zod'

export const ChangeOperatorOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicle: z.object({
    plate: z.string(),
  }),
  operators: z.array(
    z.object({
      nationalId: z.string(),
      isMainOperator: z.boolean(),
      wasAdded: z.boolean(),
      wasRemoved: z.boolean(),
    }),
  ),
})
export type ChangeOperatorOfVehicle = z.TypeOf<
  typeof ChangeOperatorOfVehicleSchema
>
