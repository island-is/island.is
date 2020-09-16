export interface Fund {
  credit: number
  used: number
  total: number
}

export interface BaseUser {
  nationalId: string
  firstName: string
  middleName: string
  lastName: string
  gender: 'kk' | 'kvk'
  fund: Fund
}

export interface User extends BaseUser {
  address: string
  postalcode: number
  city: string
}
