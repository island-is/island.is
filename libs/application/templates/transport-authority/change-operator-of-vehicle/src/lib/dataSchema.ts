import { z } from 'zod'

export const UserInformationSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().optional(),
  approved: z.boolean().optional(),
})

export const ChangeOperatorOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
    color: z.string().optional(),
  }),
  owner: UserInformationSchema,
  ownerCoOwner: z.array(UserInformationSchema),
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
