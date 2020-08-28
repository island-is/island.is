export interface ThjodskraUser {
  firstName: string
  middleName: string
  lastName: string
  gender: string // 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
  nationalId: string
}

export interface Fund {
  nationalId: string
  credit: number
  used: number
  total: number
}

export interface User extends ThjodskraUser {
  fund: Fund
  meetsADSRequirement: boolean
}
