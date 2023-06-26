import { z } from 'zod'
import { ApplicationReasons, YES } from './constants'
import { m } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  name: z.string(),
  district: z.string(),
  reason: z.object({
    reasonGiven: z.enum([ApplicationReasons.STOLEN, ApplicationReasons.LOST]),
  }),
  overview: z.object({
    confirmationCheckbox: z.array(z.string()).refine((v) => v.includes(YES), {
      params: m.requiredCheckmark,
    }),
  }),
})

export type PSignSchema = z.TypeOf<typeof dataSchema>
