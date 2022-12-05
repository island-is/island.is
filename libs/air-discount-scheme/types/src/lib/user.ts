export enum RegistryGender {
  Male = 'kk',
  Female = 'kvk',
  NonBinary = 'x',
}

export enum UncategorizedGender {
  Uncategorized = 'manneskja',
}

export type Gender = RegistryGender | UncategorizedGender

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
