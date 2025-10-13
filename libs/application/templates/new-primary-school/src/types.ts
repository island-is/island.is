import { NO, YES } from '@island.is/application/core'
import {
  AffiliationOrganizationType,
  AffiliationRole,
  CaseWorkerInputTypeEnum,
} from './utils/constants'

export type YesOrNoOrEmpty = typeof YES | typeof NO | ''

export interface RelativesRow {
  fullName: string
  phoneNumber: string
  nationalId: string
  relation: string
}

export interface SiblingsRow {
  fullName: string
  nationalId: string
}

export type Child = {
  fullName: string
  nationalId: string
  otherParent: object
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  genderCode: string
}

export type ChildInformation = {
  name: string
  nationalId: string
  address: {
    streetAddress: string
    postalCode: string
    city: string
  }
  preferredName: string
  pronouns: string[]
  differentPlaceOfResidence: string
  placeOfResidence?: {
    streetAddress: string
    postalCode: string
  }
  usePronounAndPreferredName?: string[]
}

export type SelectOption = {
  label: string
  value: string
}

export type Person = {
  nationalId: string
  fullName: string
  email: string
  phoneNumber: string
  address: {
    streetAddress: string
    streetName?: string
    postalCode: string
    city: string
  }
  requiresInterpreter: string[]
  preferredLanguage?: string
}

export type AgentModel = {
  id: string
  name: string
  email: string
  phone: string
  nationalId: string
  type: AffiliationRole
  preferredLanguage: string | null
  requiresInterpreter: boolean
}

export type Affiliation = {
  id: string
  role: AffiliationRole
  classificationId: string
  beginDate: Date
  endDate: Date | null
  organization?: AffiliationOrganization
}

export type AffiliationOrganization = {
  id: string
  nationalId: string | null
  name: string
  type: AffiliationOrganizationType
}

export type AddressModel = {
  id: string
  address: string
  municipality: string | null // Is set as object in MMS data
  postCode: string
  country: string | null // Is set as object in MMS data
  houseNumber: string | null // Is set as object in MMS data
  streetNumber: string | null // Is set as object in MMS data
  apartmentNumber: string | null // Is set as object in MMS data
  municipalityId: string | null // Is set as object in MMS data
}

export type SpecialNeedsModel = {
  id: string
  title: string // Is set as object in MMS data
  group: string // Is set as object in MMS data
  code: string
}

export type HealthProfileModel = {
  id: string
  userId: string
  allergies: string[]
  foodAllergiesOrIntolerances: string[]
  specialNeeds: SpecialNeedsModel[]
  createdAt: Date
  updatedAt: Date
  usesEpipen: boolean
  hasConfirmedMedicalDiagnoses: boolean
  requestsMedicationAdministration: boolean
}

export type CaseWorker = {
  id: string
  name: string
  email: string
  phone: string
  type: CaseWorkerInputTypeEnum
}

export type SocialProfile = {
  hasDiagnoses: boolean
  hasIntegratedServices: boolean
  caseWorkers: CaseWorker[] | null
  hasHadSupport: boolean
}

export type LanguageProfile = {
  languageEnvironment: string
  signLanguage: boolean
  preferredLanguage: string
  languages: string[]
}

export type FriggChildInformation = {
  id: string
  nationalId: string
  name: string
  nationality: string | null
  preferredName: string | null // Is set as object in MMS data
  pronouns: string[]
  gradeLevel: string
  email: string | null // Is set as object in MMS data
  domicile: AddressModel | null
  residence: AddressModel | null
  healthProfile: HealthProfileModel | null
  primaryOrgId: string // Is set as object in MMS data
  affiliations: Affiliation[] | null
  agents: AgentModel[] | null
  preferredLanguage: string | null
  phone: string // Is set as object in MMS data
  mobile: string // Is set as object in MMS data
  socialProfile: SocialProfile | null
  languageProfile: LanguageProfile | null
}

export type CurrentSchool = {
  name?: string
  grade?: string
  school?: string
  municipality?: string
}
