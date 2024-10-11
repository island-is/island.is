import {
  FieldBaseProps,
  FormText,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { UserProfile } from '@island.is/api/schema'
import { EmploymentStatus } from './constants'

export interface Status {
  type: EmploymentStatus
  confirmationOfStudies: FileType[]
}

interface FileType {
  name: string
  key: string
}

export interface FormerInsurance {
  registration: string
  country: string
  personalId: string
  confirmationOfResidencyDocument: FileType[]
  institution?: string
  entitlement: string
  entitlementReason: string
}

export interface Applicant {
  name: string
  nationalId: string
  address: string
  postalCode: string
  city: string
  email: string
  phoneNumber: string
  citizenship: string
}

export interface AdditionalInfoType {
  remarks: string
  files?: string[]
  hasAdditionalInfo?: string
}

export interface MissingInfoType {
  date: string
  remarks: string
  files?: string[]
}

export interface ReviewFieldProps extends FieldBaseProps {
  isEditable: boolean
  index?: number
}

export interface ContentType {
  title: FormText
  description: FormText | (() => void)
  buttonText: FormText
  buttonAction: () => void
}

export interface ExternalDataNationalRegistry {
  data: NationalRegistryIndividual
}

export interface ExternalDataUserProfile {
  data: UserProfile
}
