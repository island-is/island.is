import { z } from 'zod'

export const DigitalTachographDriversCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  birthPlace: z.string(),
  birthCountry: z.string(),
  phone: z.string(),
  email: z.string(),
  deliveryMethodIsSend: z.boolean(),
})

export type DigitalTachographDriversCard = z.TypeOf<
  typeof DigitalTachographDriversCardSchema
>
