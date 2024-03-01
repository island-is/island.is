import { z } from 'zod'
import {
  RejecterSchema,
  UserInformationSchema,
  CoOwnersSchema,
  OwnerCoOwnersSchema,
} from '../lib/dataSchema'
import { MessageDescriptor } from '@formatjs/intl'
import { TagVariant } from '@island.is/island-ui/core'

export type VehiclesCurrentVehicle = {
  permno?: string
  make?: string
  color?: string
  role?: string
  requireMileage?: boolean | null
}

export type CurrentVehiclesAndRecords = {
  totalRecords: number
  vehicles: VehiclesCurrentVehicle[]
}

type VehicleValidationErrorMessage = {
  errorNo?: string | null
  defaultMessage?: string | null
}

export type VehiclesCurrentVehicleWithOwnerchangeChecks = {
  permno?: string
  make?: string
  color?: string
  role?: string
  requireMileage?: boolean | null
  isDebtLess?: boolean | null
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

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
export type CoOwnersInformation = z.TypeOf<typeof CoOwnersSchema>
export type OwnerCoOwnersInformation = z.TypeOf<typeof OwnerCoOwnersSchema>
export type Rejecter = z.TypeOf<typeof RejecterSchema>
