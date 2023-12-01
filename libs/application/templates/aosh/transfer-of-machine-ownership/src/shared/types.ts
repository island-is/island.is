import {
  UserInformationSchema,
  OperatorSchema,
  RejecterSchema,
} from '../lib/dataSchema'
import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'
import { z } from 'zod'

export interface ReviewScreenProps {
  setStep?: (s: ReviewState) => void
  setLocation?: (location: MachineLocation) => void
  location?: MachineLocation
  reviewerNationalId?: string
  setBuyerOperator?: (s: Operator) => void
  buyerOperator?: Operator | null
}

export type ReviewState =
  | 'states'
  | 'overview'
  | 'conclusion'
  | 'addPeople'
  | 'location'

export type UserInformation = z.TypeOf<typeof UserInformationSchema>
export type Operator = z.TypeOf<typeof OperatorSchema>
export type Rejecter = z.TypeOf<typeof RejecterSchema>

interface ReviewerProps {
  nationalId: string
  name: string
  approved: boolean
}

export interface ReviewSectionProps {
  title: MessageDescriptor | string
  description: MessageDescriptor | string
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
  reviewer?: ReviewerProps[]
  messageValue?: string
  isComplete?: boolean
}

export type Machine = {
  id?: string
  regNumber?: string
  date?: string
  subType?: string
  type?: string
  category?: string
}

export type MachineLocation = {
  address?: string
  postCode?: number
  moreInfo?: string
}
