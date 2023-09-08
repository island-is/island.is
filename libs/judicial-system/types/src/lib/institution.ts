export enum InstitutionType {
  PROSECUTORS_OFFICE = 'PROSECUTORS_OFFICE',
  DISTRICT_COURT = 'DISTRICT_COURT',
  COURT_OF_APPEALS = 'COURT_OF_APPEALS',
  PRISON = 'PRISON',
  PRISON_ADMIN = 'PRISON_ADMIN',
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
