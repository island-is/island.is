import { z } from 'zod'
import * as kennitala from 'kennitala'

const informationSchema = z.object({
  name: z.string().min(1).max(256),
  //email: z.string().email().max(256),
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  //phoneNumber: z.string(),
})

export const PracticalExamAnswersSchema = z.object({
  information: informationSchema,
})

export type PracticalExamAnswers = z.TypeOf<typeof PracticalExamAnswersSchema>
