export enum CaseState {
  UNKNOWN = 'Óþekkt',
  DRAFT = 'Drög',
  SUBMITTED = 'Krafa staðfest',
  ACTIVE = 'Gæsluvarðhald virkt',
  COMPLETED = 'Gæsluvarðhald lokið',
}

export interface Case {
  id: string
  suspectName: string
  suspectNationalID: string
  created: Date
  modified: Date
  description: string
  status: CaseState
}
