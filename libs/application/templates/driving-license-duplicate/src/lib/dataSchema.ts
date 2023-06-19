import { z } from 'zod'
import { ApplicationReasons } from './constants'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  name: z.string(),
  district: z.string(),
  reason: z.object({
    reasonGiven: z.enum([ApplicationReasons.STOLEN, ApplicationReasons.LOST]),
  }),
})

export type PSignSchema = z.TypeOf<typeof dataSchema>
