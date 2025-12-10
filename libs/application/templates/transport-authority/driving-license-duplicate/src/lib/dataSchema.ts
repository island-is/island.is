import { z } from 'zod'
import { m } from './messages'
import { YES } from '@island.is/application/core'
import { Delivery } from './constants'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  name: z.string(),
  selectLicensePhoto: z.string().min(1),
  delivery: z
    .object({
      deliveryMethod: z.enum([Delivery.SEND_HOME, Delivery.PICKUP]).optional(),
      district: z.string().nullish(),
    })
    .refine(({ deliveryMethod, district }) => {
      return deliveryMethod === Delivery.PICKUP ? !!district : true
    }),
  reasonCheckbox: z.array(z.string()).refine((v) => v.includes(YES), {
    params: m.requiredCheckmark,
  }),
  overviewConfirmationCheckbox: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: m.requiredCheckmark,
    }),
})
