import { z } from 'zod'
import { contactInformationSchema } from '../lib/dataSchema'

export type ContactInAnswers = z.TypeOf<typeof contactInformationSchema>
