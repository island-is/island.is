import { z } from 'zod'

const nationalIdWithNameSchema = z.object({
  nationalId: z.string().length(10),
  name: z.string().min(1),
})

export const dataSchema = z.object({
  participantNationalIdAndName: nationalIdWithNameSchema,
  payerNationalId: z.string().length(10),
  payerName: z.string().min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
