import { z } from 'zod'

export const UserInformationSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().optional(),
  approved: z.boolean().optional(),
})

export const OperatorInformationSchema = z.object({
  nationalId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  approved: z.boolean().optional(),
  wasAdded: z.string().optional(),
})

export const RejecterSchema = z.object({
  plate: z.string(),
  name: z.string(),
  nationalId: z.string(),
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
  operators: z.array(OperatorInformationSchema),
  mainOperator: z.object({
    nationalId: z.string(),
  }),
  removed: z.object({
    wasRemoved: z.boolean(),
  }),
  rejecter: RejecterSchema,
})
export type ChangeOperatorOfVehicle = z.TypeOf<
  typeof ChangeOperatorOfVehicleSchema
>
