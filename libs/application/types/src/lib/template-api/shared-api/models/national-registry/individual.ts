import { Address } from './address'

export interface NationalRegistryIndividual {
  nationalId: string
  age: number
  givenName: string | null
  familyName: string | null
  fullName: string
  citizenship: {
    code: string | null
    name: string | null
  } | null
  address: Address | null
  genderCode: string
  genderDescription?: string
  maritalTitle?: {
    code?: string | null
    description?: string | null
  } | null
  birthDate: Date
}

export interface NationalRegistryOtherIndividual {
  nationalId: string
  fullName: string
  address: Address | null
}
