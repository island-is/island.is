import { z } from 'zod'

export const UserInformationSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  approved: z.boolean().optional(),
})

export const OwnerCoOwnersSchema = z.object({
  nationalId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  approved: z.boolean().optional(),
  wasRemoved: z.string().optional(),
  startDate: z.string().optional(),
})

export const RejecterSchema = z.object({
  plate: z.string(),
  name: z.string(),
  nationalId: z.string(),
})

export const ChangeCoOwnerOfVehicleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
    type: z.string().optional(),
    color: z.string().optional(),
  }),
  owner: UserInformationSchema,
  ownerCoOwners: z.array(OwnerCoOwnersSchema),
  coOwners: z.array(UserInformationSchema),
  rejecter: RejecterSchema,
})

export type ChangeCoOwnerOfVehicle = z.TypeOf<
  typeof ChangeCoOwnerOfVehicleSchema
>
