import {
  UserInformationSchema,
  CoOwnerAndOperatorSchema,
} from '../lib/dataSchema'
import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'
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

// Review

interface ReviewerProps {
  nationalId: string
  name: string
  approved: boolean
}

export interface ReviewSectionProps {
  title: string
  description: string
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
  reviewer?: ReviewerProps[]
}
