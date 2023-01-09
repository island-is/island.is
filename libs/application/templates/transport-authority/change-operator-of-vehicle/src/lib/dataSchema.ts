import { z } from 'zod'

export const UserInformationSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  approved: z.boolean().optional(),
})

export const OperatorInformationSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  approved: z.boolean().optional(),
})

export const OldOperatorInformationSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  wasRemoved: z.string().optional(),
  startDate: z.string().optional(), //TODOx need to set this value for previous operators
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
    type: z.string().optional(),
    color: z.string().optional(),
  }),
  owner: UserInformationSchema,
  ownerCoOwner: z.array(UserInformationSchema),
  vehicle: z.object({
    plate: z.string(),
  }),
  operators: z.array(OperatorInformationSchema),
  oldOperators: z.array(OldOperatorInformationSchema),
  mainOperator: z.object({
    nationalId: z.string(),
  }),
  rejecter: RejecterSchema,
})
export type ChangeOperatorOfVehicle = z.TypeOf<
  typeof ChangeOperatorOfVehicleSchema
>
