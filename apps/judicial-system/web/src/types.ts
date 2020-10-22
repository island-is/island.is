import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseState,
} from '@island.is/judicial-system/types'
import { Validation } from './utils/validate'

export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
}

export enum AppealDecitionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
}

export interface DetentionRequest {
  id: string
  policeCaseNumber: string
  accusedName: string
  accusedNationalId: string
  created: string
  modified: string
  state: CaseState
}

export interface Case {
  id: string
  created: string
  modified: string
  state: CaseState
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  court?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedCustodyEndDate?: string
  lawsBroken?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  caseFacts?: string
  legalArguments?: string
  comments?: string
  notifications?: Notification[]
  courtCaseNumber?: string
  courtStartTime?: string
  courtEndTime?: string
  courtAttendees?: string
  policeDemands?: string
  accusedPlea?: string
  litigationPresentations?: string
  ruling?: string
  rejecting?: boolean
  custodyEndDate?: string
  custodyRestrictions?: CaseCustodyRestrictions[]
  accusedAppealDecision?: CaseAppealDecision
  prosecutorAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealAnnouncement?: string
  prosecutorId?: string
  prosecutor?: User
  judgeId?: string
  judge?: User
}

export interface Notification {
  id: string
  created: string
  caseId: string
  type: NotificationType
  message: string
}

export interface GetCaseByIdResponse {
  httpStatusCode: number
  case?: Case
}

export interface SendNotificationResponse {
  httpStatusCode: number
  response?: Notification
}

export interface CreateCaseRequest {
  policeCaseNumber: string
  accusedNationalId: string
  court: string
  accusedName?: string
  accusedAddress?: string
  arrestDate?: string
  requestedCourtDate?: string
}

export interface User {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  role: string
}

export interface RequestSignature {
  controlCode: string
  documentToken: string
}

export interface RequestSignatureResponse {
  httpStatusCode: number
  response?: RequestSignature
}

export interface ConfirmSignatureResponse {
  httpStatusCode: number
  response?: Case
  code?: number
  message?: string
}

export interface RequiredField {
  value: string
  validations: Validation[]
}
