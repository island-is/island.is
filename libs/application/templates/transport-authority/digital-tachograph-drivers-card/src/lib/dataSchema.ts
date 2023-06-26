import { NO, YES } from '@island.is/application/core'
import { z } from 'zod'

export const DigitalTachographDriversCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  cardTypeSelection: z.object({
    cardType: z.enum(['firstEdition', 'reissue', 'renewal', 'reprint']),
  }),
  applicant: z.object({
    email: z.string(),
    phone: z.string().optional(),
  }),
  cardDelivery: z.object({
    deliveryMethodIsSend: z.enum([YES, NO]),
    cardExistsInTachoNet: z.boolean().optional(),
  }),
})

export type DigitalTachographDriversCard = z.TypeOf<
  typeof DigitalTachographDriversCardSchema
>
