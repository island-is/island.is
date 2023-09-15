import { z } from 'zod'

export const DigitalTachographWorkshopCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type DigitalTachographWorkshopCard = z.TypeOf<
  typeof DigitalTachographWorkshopCardSchema
>
