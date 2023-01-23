export enum InstitutionType {
  ProsecutorsOffice = 'PROSECUTORS_OFFICE',
  Court = 'COURT',
  HighCourt = 'HIGH_COURT',
  Prison = 'PRISON',
  PrisonAdmin = 'PRISON_ADMIN',
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
