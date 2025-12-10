import { Address } from './address'
import { NationalRegistryBirthplace } from './birthplace'

export interface NationalRegistrySpouse {
  name: string
  nationalId: string
  maritalStatus: string
  lastModified?: Date | null
  birthplace?: NationalRegistryBirthplace | null
  citizenship?: {
    code: string | null
    name: string | null
  } | null
  address?: Address | null
}

export interface NationalRegistrySpouseV3 {
  name: string
  nationalId: string
  maritalStatus: string
  maritalDescription: string
  lastModified?: Date | null
  birthplace?: NationalRegistryBirthplace | null
  address?: Address | null
  citizenship?: {
    code: string | null
    name: string | null
  } | null
}
