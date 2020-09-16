export enum CaseCustodyProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // d-lið 1. mgr. 95. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
}

export enum CaseCustodyRestrictions {
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
}

export enum CaseState {
  UNKNOWN = 'Óþekkt',
  DRAFT = 'Drög',
  SUBMITTED = 'Krafa staðfest',
  ACTIVE = 'Gæsluvarðhald virkt',
  COMPLETED = 'Gæsluvarðhaldi lokið',
}

export interface Case {
  id: string
  policeCaseNumber: string
  suspectName: string
  suspectNationalId: string
  created: string
  modified: string
  state: CaseState
}

export interface GetCaseByIdResponse {
  httpStatusCode: number
  case?: Case
}

export interface CreateCaseRequest {
  policeCaseNumber: string
  suspectNationalId: string
}

export interface User {
  nationalId: string
  roles: string[]
}

export interface CreateDetentionReqStepOneFields {
  policeCaseNumber: string
  suspectNationalId: string
  suspectName: string
  suspectAddress: string
  court: string
  arrestDate: Date
  arrestTime: string
  requestedCourtDate: Date
  requestedCustodyEndDate: Date
  requestedCustodyEndTime: string
  lawsBroken: string
  caseCustodyProvisions: CaseCustodyProvisions[]
  restrictions: CaseCustodyRestrictions[]
  caseFacts: string
  witnessAccounts: string
  investigationProgress: string
  legalArguments: string
  comments: string
}

export interface CreateDetentionReqStepOneCase {
  id: string
  case: CreateDetentionReqStepOneFields
}
