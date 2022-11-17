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
  gender: 'kk' | 'kvk' | 'x' | 'óvíst'
  fund: Fund
}

export interface User extends BaseUser {
  address: string
  postalcode: number
  city: string
}
