import * as z from 'zod'

import { NO, YES } from '../constants'

export const contactSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().nonempty(),
  institutionEmail: z.string().email().nonempty(),
})

export const secondaryContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export const dataSchema = z.object({
  applicant: z.object({
    institution: z.object({
      nationalId: z.string().nonempty(),
      label: z.string().nonempty(),
      isat: z.string().optional(),
    }),
  }),
  contact: contactSchema,

  hasSecondaryContact: z.enum([YES, NO]),
  secondaryContact: secondaryContactSchema,

  applicantInformation: z.object({
    constraints: z.object({
      hasMail: z.boolean().optional(),
      mail: z.boolean().optional(),

      hasLogin: z.boolean().optional(),
      login: z.boolean().optional(),

      hasStraumur: z.string().optional(),
      straumur: z.string().optional(),

      hasWebsite: z.boolean().optional(),
      website: z.boolean().optional(),

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
