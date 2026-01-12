import { YES } from '@island.is/application/core'
import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    phone: z.string().min(11),
    email: z.string().email(),
  }),
  list: z.object({
    municipality: z.string().min(1),
    name: z.string().trim().min(1),
  }),
  confirmCreationCheckbox: z.array(z.enum([YES])).length(1),
})

export type MunicipalCreateListSchema = z.TypeOf<typeof dataSchema>
