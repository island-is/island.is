import { z } from 'zod'
import * as kennitala from 'kennitala'

const informationSchema = z.object({
  name: z.string().min(1).max(256),
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
})

const examineeSchema = z.array(
  z.object({
    nationalId: z.string().refine((nationalId) => {
      console.log('nationalId', nationalId)
      console.log(
        'kennitala.isValid(nationalId)',
        kennitala.isValid(nationalId),
      )

      return (
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId)
      )
    }),
  }),
)

export const PracticalExamAnswersSchema = z.object({
  information: informationSchema,
  examinees: examineeSchema,
})

export type PracticalExamAnswers = z.TypeOf<typeof PracticalExamAnswersSchema>
