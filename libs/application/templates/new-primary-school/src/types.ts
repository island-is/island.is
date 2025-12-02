import { NO, YES } from '@island.is/application/core'
import {
  AffiliationRole,
  AgentType,
  ApplicationFeatureConfigType,
  CaseWorkerInputTypeEnum,
  OrganizationSector,
  OrganizationSubType,
  OrganizationType,
} from './utils/constants'

export type YesOrNoOrEmpty = typeof YES | typeof NO | ''

export interface RelativesRow {
  nationalIdWithName: {
    name: string
    nationalId: string
  }
  phoneNumber: string
  relation: string
}

export interface SiblingsRow {
  nationalIdWithName: {
    name: string
    nationalId: string
  }
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
  name: string
  nationalId: string
  preferredName: string | null
  nationality: string | null
  pronouns: string[] | null
  type: AgentType
  relationTypeId: string | null
  phone: string
  email: string
  domicile: AddressModel | null
  requiresInterpreter: boolean
  preferredLanguage: string | null
}

export type Affiliation = {
  id: string
  role: AffiliationRole
  classificationId: string
  beginDate: Date
  endDate: Date | null
  email: string
  phone: string
  organization: AffiliationOrganization | null
}

export type ApplicationFeatureModel = {
  key: string
}

export type ApplicationFeatureConfig = {
  applicationType: ApplicationFeatureConfigType
  applicationFeatures: ApplicationFeatureModel[]
}

export type ApplicationSettings = {
  applicationConfigs: ApplicationFeatureConfig[]
}

export type AffiliationOrganization = {
  id: string
  nationalId: string | null
  name: string
  type: OrganizationType
  subType: OrganizationSubType
  sector: OrganizationSector
}

export type AddressModel = {
  id: string
  address: string
  municipality: string | null
  postCode: string
  country: string | null
  houseNumber: number | null
  streetNumber: number | null
  apartmentNumber: number | null
  municipalityId: string | null
}

export type HealthProfileModel = {
  id: string
  userId: string
  allergies: string[]
  foodAllergiesOrIntolerances: string[]
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
  id: string
  userId: string
  hasDiagnoses: boolean
  hasIntegratedServices: boolean
  caseWorkers: CaseWorker[] | null
  hasHadSupport: boolean
}

export type LanguageProfile = {
  id: string
  userId: string
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
  preferredName: string | null
  pronouns: string[]
  gradeLevel: string
  email: string | null
  domicile: AddressModel | null
  residence: AddressModel | null
  healthProfile: HealthProfileModel | null
  primaryOrgId: string
  affiliations: Affiliation[] | null
  agents: AgentModel[] | null
  preferredLanguage: string | null
  phone: string
  mobile: string
  socialProfile: SocialProfile | null
  languageProfile: LanguageProfile | null
}

export type CurrentSchool = {
  name?: string
  grade?: string
  school?: string
  municipality?: string
}

export type Organization = {
  id: string
  name: string
  type: OrganizationType
  subType: OrganizationSubType
  sector: OrganizationSector
  gradeLevels: string[]
  unitId: string | null
  settings: ApplicationSettings | null
}
