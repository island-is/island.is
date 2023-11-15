import {
  UserInformationSchema,
  CoOwnerAndOperatorSchema,
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
  setCoOwnersAndOperators?: (s: CoOwnerAndOperator[]) => void
  coOwnersAndOperators?: CoOwnerAndOperator[]
  setMainOperator?: (s: string) => void
  mainOperator?: string
}

export type ReviewState =
  | 'states'
  | 'overview'
  | 'conclusion'
  | 'addPeople'
  | 'mainOperator'
  | 'location'

export type UserInformation = z.TypeOf<typeof UserInformationSchema>
export type CoOwnerAndOperator = z.TypeOf<typeof CoOwnerAndOperatorSchema>
export type Rejecter = z.TypeOf<typeof RejecterSchema>

// Review
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

export type InsuranceCompany = {
  code?: string | null
  name?: string | null
}

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

export type VehiclesCurrentVehicleWithOwnerchangeChecks = {
  permno?: string
  make?: string
  color?: string
  role?: string
  isDebtLess?: boolean | null
  validationErrorMessages?: VehicleValidationErrorMessage[] | null
}

type MachineLink = {
  href: string
  rel: string
  method: string
  displayTitle: string
}

export type Machine = {
  id?: string
  registrationNumber?: string
  type?: string
  owner?: string
  supervisor?: string
  status?: string
  dateLastInspection?: string
  category?: string
  ownerNumber?: string
  licensePlateNumber?: string
  _links?: MachineLink[] | null
}

export type MachineDetails = {
  id?: string
  registrationNumber?: string
  type?: string
  status?: string
  category?: string
  subCategory?: string
  productionYear?: number
  registrationDate?: string
  ownerNumber?: string | null
  productionNumber?: string
  productionCountry?: string
  licensePlateNumber?: string | null
  importer?: string
  insurer?: string
  ownerName?: string
  ownerNationalId?: string
  ownerAddress?: string
  ownerPostcode?: string
  supervisorName?: string
  supervisorNationalId?: string
  supervisorAddress?: string
  supervisorPostcode?: string
  _links?: MachineLink[] | null
}

export type MachineLocation = {
  address?: string
  postCode?: number
  moreInfo?: string
}
