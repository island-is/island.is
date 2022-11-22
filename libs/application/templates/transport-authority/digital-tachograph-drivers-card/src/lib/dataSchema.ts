import { NO, YES } from '@island.is/application/core'
import { z } from 'zod'

export const DigitalTachographDriversCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  cardType: z.enum(['firstEdition', 'reissue', 'renewal', 'reprint']),
  birthPlace: z.string(),
  birthCountry: z.string(),
  phone: z.string(),
  email: z.string(),
  deliveryMethodIsSend: z.enum([YES, NO]),
})

export type DigitalTachographDriversCard = z.TypeOf<
  typeof DigitalTachographDriversCardSchema
>
