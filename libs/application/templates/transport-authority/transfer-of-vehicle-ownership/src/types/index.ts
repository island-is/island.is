import {
  UserInformationSchema,
  CoOwnerAndOperatorSchema,
} from '../lib/dataSchema'
import { z } from 'zod'

export interface ReviewScreenProps {
  setStep: (s: ReviewState) => void
  setInsurance?: (s: string) => void
  insurance?: string
}

export type ReviewState =
  | 'states'
  | 'overview'
  | 'conclusion'
  | 'addPeople'
  | 'insurance'

export type UserInformation = z.TypeOf<typeof UserInformationSchema>
export type CoOwnerAndOperator = z.TypeOf<typeof CoOwnerAndOperatorSchema>
