import { z } from 'zod'
import { contactInformationSchema } from '../lib/dataSchema'

export type Machine = {
  id?: string
  regNumber?: string
  date?: string
  subType?: string
  type?: string
  category?: string
  plate?: string
  ownerNumber?: string
}

export type ContactInAnswers = z.TypeOf<typeof contactInformationSchema>
