export type RegistryGender = 'kk' | 'kvk' | 'x' | 'hvk'

export type UncategorizedGender = 'manneskja'

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
