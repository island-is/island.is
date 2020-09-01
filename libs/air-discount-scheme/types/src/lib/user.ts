export interface Fund {
  nationalId: string
  credit: number
  used: number
  total: number
}

export interface User {
  nationalId: string
  firstName: string
  middleName: string
  lastName: string
  gender: 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
  fund: Fund
}
