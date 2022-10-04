import * as z from 'zod'

import { NO, YES } from '../constants'

export const contactSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().nonempty(),
})

export const dataSchema = z.object({
  applicant: z.object({
    institution: z.object({
      nationalId: z.string().nonempty(),
      label: z.string().nonempty(),
      isat: z.string().optional(),
    }),
    institutionEmail: z.string().email().nonempty(),
  }),
  contact: contactSchema,

  hasSecondaryContact: z.enum([YES, NO]),
  secondaryContact: contactSchema.deepPartial(),

  applicantInformation: z.object({
    constraints: z.object({
      hasMail: z.boolean().optional(),
      hasLogin: z.boolean().optional(),
      hasStraumur: z.string().optional(),
      hasWebsite: z.boolean().optional(),

      hasApply: z.string().optional(),
      apply: z.string().optional(),

      hasMyPages: z.string().optional(),
      myPages: z.string().optional(),

      hasCert: z.string().optional(),
      cert: z.string().optional(),

      hasConsult: z.string().optional(),
      consult: z.string().optional(),
    }),
  }),
})
