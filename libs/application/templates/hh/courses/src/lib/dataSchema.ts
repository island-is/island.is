import { z } from 'zod'

const nationalIdWithNameSchema = z.object({
  nationalId: z.string(),
  name: z.string(),
})

export const dataSchema = z.object({
  participantNationalIdAndName: nationalIdWithNameSchema,
  payerNationalId: z.string(),
  payerName: z.string(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
