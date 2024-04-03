import { z } from 'zod'

const UserInformationSchema = z.object({
  email: z.string().min(1),
  phone: z.string().min(1),
})

const SelectWorkPermitSchema = z.object({
  studyProgram: z.string().min(1),
  //idProfession: z.string().min(1),
})

export const HealthcareWorkPermitSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: UserInformationSchema,
  selectWorkPermit: SelectWorkPermitSchema,
})

export type HealthcareWorkPermit = z.TypeOf<typeof HealthcareWorkPermitSchema>
