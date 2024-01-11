import { NO, YES } from '@island.is/application/core'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'

export const HomeSupportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  receivesDoctorService: z.enum([YES, NO]),
  reason: z.string().optional(),
  exemption: z.array(z.enum([YES])).optional(),
})

export type HomeSupport = z.TypeOf<typeof HomeSupportSchema>
