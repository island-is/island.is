import { z } from 'zod'
import {
  OperatorInformationSchema,
  RejecterSchema,
  UserInformationSchema,
  OldOperatorInformationSchema,
} from '../lib/dataSchema'
import { MessageDescriptor } from '@formatjs/intl'
import { TagVariant } from '@island.is/island-ui/core'

export type VehiclesCurrentVehicle = {
  permno?: string
  make?: string
  color?: string
  role?: string
}

type VehicleValidationErrorMessage = {
  errorNo?: string | null
  defaultMessage?: string | null
}

export type VehiclesCurrentVehicleWithOperatorChangeChecks = {
  permno?: string
  make?: string
  color?: string
  role?: string
  isDebtLess?: boolean | null
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

export type OperatorField = {
  nationalId: string
  name: string
  email: string
  phone: string
  approved?: boolean
}

export type OperatorFormField = Partial<
  OperatorField & {
    id: string
    initial: boolean
    dummy?: boolean
  }
>

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
}

export interface ReviewScreenProps {
  setStep?: (s: ReviewState) => void
  reviewerNationalId?: string
}

export type ReviewState = 'states' | 'overview' | 'conclusion'

export type UserInformation = z.TypeOf<typeof UserInformationSchema>
export type OperatorInformation = z.TypeOf<typeof OperatorInformationSchema>
export type Rejecter = z.TypeOf<typeof RejecterSchema>
export type OldOperatorInformation = z.TypeOf<
  typeof OldOperatorInformationSchema
>
export type OldOperatorInformationFormField = Partial<
  OldOperatorInformation & {
    id: string
    initial: boolean
    dummy?: boolean
  }
>
