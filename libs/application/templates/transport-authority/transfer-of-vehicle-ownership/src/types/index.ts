import {
  UserInformationSchema,
  CoOwnerAndOperatorSchema,
} from '../lib/dataSchema'
import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'
import { z } from 'zod'

export type ReviewCoOwnerAndOperatorField = {
  nationalId: string
  name: string
  email: string
  phone: string
  type: 'operator' | 'coOwner'
  approved?: boolean
}

export interface ReviewScreenProps {
  setStep?: (s: ReviewState) => void
  setInsurance?: (s: string) => void
  insurance?: string
  reviewerNationalId?: string
  setCoOwnersAndOperators?: (s: ReviewCoOwnerAndOperatorField[]) => void
  coOwnersAndOperators?: ReviewCoOwnerAndOperatorField[]
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
