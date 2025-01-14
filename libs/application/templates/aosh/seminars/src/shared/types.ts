import { z } from 'zod'
import {
  ParticipantSchema,
  PaymentArrangementSchema,
  SeminarAnswersSchema,
} from '../lib/dataSchema'

export type SeminarAnswersSchema = z.TypeOf<typeof SeminarAnswersSchema>
export type PaymentArrangementType = z.TypeOf<typeof PaymentArrangementSchema>
export type Participant = z.TypeOf<typeof ParticipantSchema>
