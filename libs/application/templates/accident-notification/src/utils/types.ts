import { YesOrNo } from '@island.is/application/core'
import { companyInfo, representativeInfo } from '../lib/messages'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from './enums'
import { DefaultEvents } from '@island.is/application/types'

// Interfaces
export interface SubmittedApplicationData {
  data?: {
    documentId: number
    sentDocuments: string[]
  }
}

export interface ReviewAddAttachmentData {
  data?: {
    sentDocuments: string[]
  }
}

// Types
export type AccidentNotificationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }

export type CompanyInfo = {
  nationalRegistrationId: string
  name: string
  type: AccidentTypeEnum | WorkAccidentTypeEnum
  onPayRoll?: {
    answer: YesOrNo
  }
}

export type Applicant = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  jobTitle?: string
}

export type AccidentNotifTypes =
  | 'InjuryCertificate'
  | 'ProxyDocument'
  | 'PoliceReport'
  | 'Unknown'

export type AccidentNotificationAttachmentStatus = {
  InjuryCertificate?: boolean | null
  ProxyDocument?: boolean | null
  PoliceReport?: boolean | null
  Unknown?: boolean | null
}

export type RepresentativeInfo = {
  name: string
  nationalId: string
  email: string
  phoneNumber?: string
}

export type FileType = {
  url?: string | undefined
  name: string
  key: string
}

// Types for accident notification API
export type ApplicantV2 = {
  address?: string | null
  city?: string | null
  email?: string | null
  name?: string | null
  nationalId?: string | null
  phoneNumber?: string | null
  postalCode?: string | null
}

export type InjuredPersonInformationV2 = {
  email?: string | null
  jobTitle?: string | null
  name?: string | null
  nationalId?: string | null
  phoneNumber?: string | null
}

export type AccidentDetailsV2 = {
  accidentSymptoms?: string | null
  dateOfAccident?: string | null
  dateOfDoctorVisit?: string | null
  descriptionOfAccident?: string | null
  timeOfAccident?: string | null
  timeOfDoctorVisit?: string | null
}

export type HomeAccidentV2 = {
  address?: string | null
  community?: string | null
  moreDetails?: string | null
  postalCode?: string | null
}

export type WorkMachineV2 = {
  descriptionOfMachine?: string | null
}

export type FishingShipInfoV2 = {
  homePort?: string | null
  shipCharacters?: string | null
  shipName?: string | null
  shipRegisterNumber?: string | null
}

export type CompanyInfoV2 = {
  name?: string | null
  nationalRegistrationId?: string | null
}

export type RepresentativeInfoV2 = {
  email?: string | null
  name?: string | null
  nationalId?: string | null
  phoneNumber?: string | null
}

export type WorkplaceData = {
  companyInfo: CompanyInfo
  representitive: RepresentativeInfo
  companyInfoMsg: typeof companyInfo
  representitiveMsg: typeof representativeInfo
  type: WorkAccidentTypeEnum | AccidentTypeEnum
  onPayRoll?: YesOrNo
  screenId: string
}
