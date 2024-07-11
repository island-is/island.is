export enum FSIUSERTYPE {
  INDIVIDUAL = 150000000,
  PARTY = 150000001,
  CEMETRY = 150000002,
}

export const LESS = 'less'

export type BoardMember = {
  nationalId: string
  name: string
  role: string
}
