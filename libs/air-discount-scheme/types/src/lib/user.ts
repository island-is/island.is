export interface Fund {
  credit: number
  used: number
  total: number
}

export interface AirlineUser {
  nationalId: string
  firstName: string
  middleName: string
  lastName: string
  gender: 'kk' | 'kvk'
  fund: Fund
}

export interface User extends AirlineUser {
  address: string
  postalcode: number
  city: string
}
