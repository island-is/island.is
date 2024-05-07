import { z } from 'zod'

const UserInformationSchema = z.object({
  email: z.string().min(1),
  phone: z.string().min(1),
})


export const HealthcareWorkPermitSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
})

export type HealthcareWorkPermit = z.TypeOf<
  typeof HealthcareWorkPermitSchema
>
