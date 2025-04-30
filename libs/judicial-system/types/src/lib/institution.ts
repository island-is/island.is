export enum InstitutionType {
  POLICE_PROSECUTORS_OFFICE = 'POLICE_PROSECUTORS_OFFICE',
  DISTRICT_PROSECUTORS_OFFICE = 'DISTRICT_PROSECUTORS_OFFICE',
  PUBLIC_PROSECUTORS_OFFICE = 'PUBLIC_PROSECUTORS_OFFICE',
  DISTRICT_COURT = 'DISTRICT_COURT',
  COURT_OF_APPEALS = 'COURT_OF_APPEALS',
  PRISON = 'PRISON',
  PRISON_ADMIN = 'PRISON_ADMIN',
}

export const adminInstitutionScope: {
  [key in InstitutionType]: InstitutionType[]
} = {
  POLICE_PROSECUTORS_OFFICE: [InstitutionType.POLICE_PROSECUTORS_OFFICE],
  DISTRICT_PROSECUTORS_OFFICE: [InstitutionType.DISTRICT_PROSECUTORS_OFFICE],
  PUBLIC_PROSECUTORS_OFFICE: [InstitutionType.PUBLIC_PROSECUTORS_OFFICE],
  DISTRICT_COURT: [
    InstitutionType.DISTRICT_COURT,
    InstitutionType.COURT_OF_APPEALS,
  ],
  COURT_OF_APPEALS: [
    InstitutionType.DISTRICT_COURT,
    InstitutionType.COURT_OF_APPEALS,
  ],
  PRISON: [InstitutionType.PRISON, InstitutionType.PRISON_ADMIN],
  PRISON_ADMIN: [InstitutionType.PRISON, InstitutionType.PRISON_ADMIN],
}

export const prosecutorsOfficeTypes = [
  InstitutionType.POLICE_PROSECUTORS_OFFICE,
  InstitutionType.DISTRICT_PROSECUTORS_OFFICE,
  InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
]

export const isProsecutorsOffice = (
  institutionType: InstitutionType | null | undefined,
) => institutionType && prosecutorsOfficeTypes.includes(institutionType)

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
  address?: string
}
