import { z } from 'zod'

export const OfficalJournalOfIcelandSchema = z.object({
  approveExternalData: z.boolean(),
})
