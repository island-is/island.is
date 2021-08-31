export enum InstitutionType {
  PROSECUTORS_OFFICE = 'PROSECUTORS_OFFICE',
  COURT = 'COURT',
}

export interface Institution {
  id: string
  created: string
  modified: string
  type: InstitutionType
  name: string
}
