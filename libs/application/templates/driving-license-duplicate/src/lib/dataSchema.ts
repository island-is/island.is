import { z } from 'zod'
import { YES } from './constants'
import { m } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  name: z.string(),
  district: z.string(),
  reason: z.object({
    confirmationCheckbox: z.array(z.string()).refine((v) => v.includes(YES), {
      params: m.requiredCheckmark,
    }),
  }),
  overview: z.object({
    confirmationCheckbox: z.array(z.string()).refine((v) => v.includes(YES), {
      params: m.requiredCheckmark,
    }),
  }),
})
