import { dateSchema } from '../lib/dataSchema'
import { z } from 'zod'

export type DateInAnswers = z.TypeOf<typeof dateSchema>
