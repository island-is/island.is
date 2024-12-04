import { z } from 'zod'
import * as kennitala from 'kennitala'

export const PracticalExamAnswersSchema = z.object({})

export type PracticalExamAnswers = z.TypeOf<typeof PracticalExamAnswersSchema>
