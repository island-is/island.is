import { CaseState } from '@island.is/judicial-system/types'

export enum CustodyProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // d-lið 1. mgr. 95. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
}

export enum CustodyRestrictions {
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
}

export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
}

export interface DetentionRequest {
  id: string
  policeCaseNumber: string
  suspectName: string
  suspectNationalId: string
  created: string
  modified: string
  state: CaseState
}

export interface Case {
  id: string
  created: Date
  modified: Date
  state: CaseState
  policeCaseNumber: string
  suspectNationalId: string
  suspectName?: string
  suspectAddress?: string
  court?: string
  arrestDate?: Date
  requestedCourtDate?: Date
  requestedCustodyEndDate?: Date
  lawsBroken?: string
  custodyProvisions?: CustodyProvisions[]
  custodyRestrictions?: CustodyRestrictions[]
  caseFacts?: string
  witnessAccounts?: string
  investigationProgress?: string
  legalArguments?: string
  comments?: string
  notifications?: Notification[]
  courtCaseNumber?: string
  courtStartTime?: Date
  courtEndTime?: Date
  courtAttendees?: string
  policeDemands?: string
  suspectPlea?: string
  litigationPresentations?: string
}

export interface Notification {
  id: string
  created: Date
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
  suspectNationalId: string
}

export interface User {
  nationalId: string
  roles: string[]
}
