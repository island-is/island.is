import { UserInformationSchema } from '../lib/dataSchema'
import * as z from 'zod'

export interface ReviewScreenProps {
  setStep: (s: ReviewState) => void
}

export type ReviewState =
  | 'states'
  | 'overview'
  | 'conclusion'
  | 'addPeople'
  | 'insurance'

export type UserInformation = z.TypeOf<typeof UserInformationSchema>
