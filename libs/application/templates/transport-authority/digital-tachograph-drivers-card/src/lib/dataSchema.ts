import { NO, YES } from '@island.is/application/core'
import { z } from 'zod'
import { CardType } from '../shared'

export const DigitalTachographDriversCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  cardTypeSelection: z.object({
    cardType: z.enum([
      CardType.FIRST_EDITION,
      CardType.REISSUE,
      CardType.RENEWAL,
      CardType.REPRINT,
    ]),
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
