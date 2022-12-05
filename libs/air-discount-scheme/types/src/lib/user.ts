export enum Gender {
  Male = 'kk',
  Female = 'kvk',
  NonBinary = 'x',
  Uncategorized = 'manneskja',
}

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
  gender: Gender
  fund: Fund
}

export interface User extends BaseUser {
  address: string
  postalcode: number
  city: string
}
