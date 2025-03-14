import { z } from 'zod'
import {
  ParticipantSchema,
  PaymentArrangementSchema,
  SeminarAnswersSchema,
} from '../lib/dataSchema'
import { MessageDescriptor } from 'react-intl'

export type SeminarAnswersSchema = z.TypeOf<typeof SeminarAnswersSchema>
export type PaymentArrangementType = z.TypeOf<typeof PaymentArrangementSchema>
export type Participant = z.TypeOf<typeof ParticipantSchema>
export enum FileUploadStatus {
  'error',
  'done',
  'uploading',
}

export interface CSVError {
  items: Array<number>
  error: MessageDescriptor
}
