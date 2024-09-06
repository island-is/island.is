import { z } from 'zod'

const UserInformationSchema = z.object({
  email: z.string().min(1),
  phone: z.string().min(1),
  nationalId: z.string().min(1),
  name: z.string().min(1),
  birthDate: z.string().min(1),
  citizenship: z.string().min(1),
})

const SelectWorkPermitSchema = z.object({
  programId: z.string().min(1),
})

export const HealthcareWorkPermitSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectWorkPermit: SelectWorkPermitSchema,
})

export type HealthcareWorkPermit = z.TypeOf<typeof HealthcareWorkPermitSchema>
