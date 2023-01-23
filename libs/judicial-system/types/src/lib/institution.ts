export enum InstitutionType {
  ProsecutorsOffice = 'ProsecutorsOffice',
  Court = 'Court',
  HighCourt = 'HighCourt',
  Prison = 'Prison',
  PrisonAdmin = 'PrisonAdmin',
}

export interface Institution {
  id: string
  created: string
  modified: string
  type: InstitutionType
  name: string
  active: boolean
  defaultCourtId?: string
  policeCaseNumberPrefix?: string
  nationalId?: string
}
