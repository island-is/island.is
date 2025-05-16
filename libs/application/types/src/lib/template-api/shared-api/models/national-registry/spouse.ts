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
  marriedOrCohabitaiton: SpouseSource
}

export interface NormalizedNationalRegistrySpouse {
  source: SpouseSource
  spouseName: string
  spouseNationalId: string
  status: string
  code?: string
  lastModified?: Date | null
}

export enum SpouseSource {
  HJUSKAPUR = 'hjuskapur',
  SAMBUD = 'sambud',
}
