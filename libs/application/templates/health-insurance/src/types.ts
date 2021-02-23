import { FieldBaseProps, FormText } from '@island.is/application/core'
import { NationalRegistryUser, UserProfile } from '@island.is/api/schema'

export enum StatusTypes {
  PENSIONER = 'pensioner',
  STUDENT = 'student',
  OTHER = 'other',
  EMPLOYED = 'employed',
}

export enum NordicCountries {
  NORWAY = 'Norway',
  DENMARK = 'Denmark',
  SWEDEN = 'Sweden',
  FINLAND = 'Finland',
  FAROE_ISLANDS = 'Faroe Islands',
  GREENLAND = 'Greenland',
  ALAND = 'Åland Islands',
  SVALBARD = 'Svalbard and Jan Mayen', // because this is in the list of countries we get from api
}

export interface Status {
  type: StatusTypes
  confirmationOfStudies: FileType[]
}

interface FileType {
  name: string
  key: string
  url: string
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

export type Country = {
  name: string
  alpha2Code: string
  regionalBlocs: CountryReginalBlocs[]
}

type CountryReginalBlocs = {
  acronym: string
}

export interface ExternalDataNationalRegistry {
  data: NationalRegistryUser
}

export interface ExternalDataUserProfile {
  data: UserProfile
}
