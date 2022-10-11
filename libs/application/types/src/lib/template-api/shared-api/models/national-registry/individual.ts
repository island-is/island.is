import { Address } from './address'

export interface NationalRegistryIndividual {
  nationalId: string
  age: number
  fullName: string
  citizenship: {
    code: string | null
    name: string | null
  } | null
  address: Address | null
  genderCode: string
}
