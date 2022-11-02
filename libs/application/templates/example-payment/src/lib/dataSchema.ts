import { z } from 'zod'

export const dataSchema = z.object({
  userSelectedChargeItemCode: z.string().min(1),
})
