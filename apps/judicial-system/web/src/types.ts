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
  description: string
  state: CaseState
}

export interface CreateCaseRequest {
  description: string
  policeCaseNumber: string
  suspectNationalId: string
  suspectName: string
}

export interface WorkingCase {
  id: string
  case: CreateCaseRequest
}
