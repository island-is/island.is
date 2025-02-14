import { z } from 'zod'
import { m } from './messages'
import { YES } from '@island.is/application/core'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  name: z.string(),
  delivery: z
    .object({
      deliveryMethod: z.enum(['1', '2']).optional(),
      district: z.string().nullish(),
    })
    .refine(({ deliveryMethod, district }) => {
      return deliveryMethod === '2' ? !!district : true
    }),
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
