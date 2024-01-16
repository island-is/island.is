import { NO, YES } from '@island.is/application/core'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { errors } from './messages'

export const HomeSupportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  receivesDoctorService: z.enum([YES, NO]),
  reason: z.string().optional(),
  exemption: z.array(z.enum([YES])).optional(),
  contacts: z
    .array(
      z.object({
        name: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        email: z
          .string()
          .email()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        phone: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        relation: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
      }),
    )
    .optional(),
})

export type HomeSupport = z.TypeOf<typeof HomeSupportSchema>
